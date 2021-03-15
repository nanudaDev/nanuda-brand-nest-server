import { Injectable } from '@nestjs/common';
import { CompressionTypes } from '@nestjs/common/interfaces/external/kafka-options.interface';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { Console } from 'console';
import { of } from 'rxjs';
import { DeliverySpaceConversion, ScoreConversionUtil } from 'src/common/utils';
import { BaseDto, BaseService } from 'src/core';
import { KB_MEDIUM_CATEGORY } from 'src/shared';
import { EntityManager, getConnection, Repository } from 'typeorm';
import { CommonCode } from '../common-code/common-code.entity';
import { ConsultResult } from '../consult-record/consult-record.entity';
import { LocationAnalysisService } from '../data/location-analysis/location-analysis.service';
import { AggregateResultResponseBackup } from './aggregate-result-response-backup.entity';
import { AggregateResultResponse } from './aggregate-result-response.entity';
import { AggregateResultResponseQueryDto } from './dto';

class DeliveryRestaurantRatioClass extends BaseDto<
  DeliveryRestaurantRatioClass
> {
  deliveryRatio: number;
  deliveryRevenue: number;
  mediumCategoryName: string;
  offlineRatio: number;
  offlineRevenue: number;
}

// class ResponseArrayClass extends BaseDto<ResponseArrayClass> {
//   BREAKFAST
// }

@Injectable()
export class AggregateResultResponseService extends BaseService {
  constructor(
    @InjectRepository(AggregateResultResponse)
    private readonly responseRepo: Repository<AggregateResultResponse>,
    @InjectRepository(ConsultResult)
    private readonly consultResultRepo: Repository<ConsultResult>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly locationAnalysisService: LocationAnalysisService,
  ) {
    super();
  }

  /**
   * find question
   * @param aggregateQuestionQuery
   */
  async findResponseForQuestions(
    aggregateQuestionQuery?: AggregateResultResponseQueryDto,
  ) {
    // 상권 관련 배달 - 홀 비중
    const deliveryRatioData = await this.locationAnalysisService.locationInfoDetail(
      aggregateQuestionQuery.hdongCode,
    );
    const responseArray = [];
    // const questionResponse = await this.entityManager.transaction(
    //   async entityManager => {
    //     await Promise.all(
    //       aggregateQuestionQuery.operationTimes.map(async times => {

    //       }),
    //     );
    //   },
    // );
    // get for each time slot
    const forEachTimeSlot = await Axios.get(
      `${this.analysisUrl}location-hour-small-category`,
      {
        params: { hdongCode: aggregateQuestionQuery.hdongCode },
      },
    );

    const deliveryRatioGradeFilteredByCategory = new DeliveryRestaurantRatioClass(
      deliveryRatioData[aggregateQuestionQuery.kbFoodCategory],
    );
    if (!deliveryRatioGradeFilteredByCategory.deliveryRatio) {
      deliveryRatioData.deliveryRatio = 0;
    }
    const deliveryRatioGrade = DeliverySpaceConversion(
      deliveryRatioGradeFilteredByCategory.deliveryRatio,
    );
    const scoreCard = ScoreConversionUtil(aggregateQuestionQuery);
    scoreCard.deliveryRatioGrade = deliveryRatioGrade;
    const response = await this.responseRepo
      .createQueryBuilder('response')
      .AndWhereEqual('response', 'ageGroupGrade', scoreCard.ageGroupGrade, null)
      .AndWhereEqual(
        'response',
        'revenueRangeGrade',
        scoreCard.revenueRangeGrade,
        null,
      )
      .AndWhereEqual(
        'response',
        'deliveryRatioGrade',
        scoreCard.deliveryRatioGrade,
        null,
      )
      .AndWhereEqual('response', 'isReadyGrade', scoreCard.isReadyGrade, null)
      .AndWhereLike('response', 'fnbOwnerStatus', scoreCard.fnbOwnerStatus)
      .getOne();

    // save to consult table

    return forEachTimeSlot.data;
  }

  /**
   * transfer data
   */
  async transferData() {
    const transfer = await this.entityManager.transaction(
      async entityManager => {
        const qb = await this.entityManager
          .getRepository(AggregateResultResponseBackup)
          .createQueryBuilder('backup')
          .getMany();
        await Promise.all(
          qb.map(async q => {
            let newResponse = new AggregateResultResponse().set(q);
            newResponse.response = newResponse.response.replace(
              '"중분류"',
              'MEDIUM_CODE',
            );
            newResponse.response = newResponse.response.replace(
              '"소분류"',
              'SMALL_CODE',
            );
            const qb = await this.responseRepo
              .createQueryBuilder('response')
              .getMany();
            if (qb && qb.length < 1) {
              newResponse = await entityManager.save(newResponse);
            }
          }),
        );
      },
    );
  }
}
