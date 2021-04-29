import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { QUESTION_TYPE } from 'src/shared';
import { EntityManager, Repository } from 'typeorm';
import { QuestionGivenArrayClass } from '../aggregate-result-response/dto';
import { CodeHdongService } from '../code-hdong/code-hdong.service';
import { CScoreAttribute, SScoreDelivery, SScoreRestaurant } from '../data';
import { CScoreService } from '../data/c-score/c-score.service';
import { LocationAnalysisService } from '../data/location-analysis/location-analysis.service';
import { QuestionGivenV2 } from '../question-given-v2/question-given-v2.entity';
import { QuestionV2 } from '../question-v2/question-v2.entity';
import { ProformaConsultResultV2QueryDto } from './dto';
import { ProformaConsultResultV2 } from './proforma-consult-result-v2.entity';

@Injectable()
export class ProformaConsultResultV2Service extends BaseService {
  constructor(
    @InjectRepository(SScoreDelivery, 'wq')
    private readonly sScoreDelivery: Repository<SScoreDelivery>,
    @InjectRepository(SScoreRestaurant, 'wq')
    private readonly sScoreRestaurant: Repository<SScoreRestaurant>,
    @InjectRepository(ProformaConsultResultV2)
    private readonly proformaConsultRepo: Repository<ProformaConsultResultV2>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly locationAnalysisService: LocationAnalysisService,
    private readonly cScoreService: CScoreService,
    private readonly codeHdongService: CodeHdongService,
  ) {
    super();
  }

  async findResponseToQuestion(
    proformaConsultResultQueryDto: ProformaConsultResultV2QueryDto,
  ) {
    //   latest c-score attribute value
    const cScoreAttributeValue = await this.cScoreService.findValid();
    const deliveryRatioData = await this.locationAnalysisService.locationInfoDetail(
      proformaConsultResultQueryDto.hdongCode,
    );
    const averageRatioArray: number[] = [];
    Object.keys(deliveryRatioData).forEach(function(key) {
      if (deliveryRatioData[key].deliveryRatio === null) {
        deliveryRatioData[key].deliveryRatio = 0;
      }
      if (
        deliveryRatioData[key] === 'F05' ||
        deliveryRatioData[key] === 'F08' ||
        deliveryRatioData[key] === 'F09' ||
        deliveryRatioData[key] === 'F13' ||
        deliveryRatioData[key] === 'F03'
      ) {
        delete deliveryRatioData[key];
      }
      averageRatioArray.push(deliveryRatioData[key].deliveryRatio);
    });
    const average =
      averageRatioArray.reduce((prev, curr) => prev + curr) /
      averageRatioArray.length;
    console.log(average);
    const hdong = await this.codeHdongService.findOneByCode(
      proformaConsultResultQueryDto.hdongCode,
    );
    // 질문 관련 값
    const questionScores = await this.__question_c_score_add(
      proformaConsultResultQueryDto.questionGivenArray,
    );
    // get both restaurant and delivery data first
    // const appliedCScore =
  }

  //  add all questions depending on question types
  // TODO: figure out a way to automatically loop through enum
  private async __question_c_score_add(questions?: QuestionGivenArrayClass[]) {
    let menuScoreArray = [];
    let operatingScoreArray = [];
    let initialCostScoreArray = [];
    await Promise.all(
      questions.map(async qId => {
        const questionD = await this.entityManager
          .getRepository(QuestionV2)
          .findOne(qId.questionId);
        if (questionD.questionType === QUESTION_TYPE.MENU_SCORE_TYPE) {
          qId.givenId.map(async givenId => {
            const value = await this.entityManager
              .getRepository(QuestionGivenV2)
              .findOne(givenId);
            menuScoreArray.push(value.value);
          });
        }
        if (
          questionD.questionType === QUESTION_TYPE.OPERATION_COST_SCORE_TYPE
        ) {
          qId.givenId.map(async givenId => {
            const value = await this.entityManager
              .getRepository(QuestionGivenV2)
              .findOne(givenId);
            initialCostScoreArray.push(value.value);
          });
        }
        if (questionD.questionType === QUESTION_TYPE.OPERATION_SCORE_TYPE) {
          qId.givenId.map(async givenId => {
            const value = await this.entityManager
              .getRepository(QuestionGivenV2)
              .findOne(givenId);
            operatingScoreArray.push(value.value);
          });
        }
      }),
    );
    menuScoreArray = menuScoreArray.reduce((a, b) => a + b, 0);
    operatingScoreArray = operatingScoreArray.reduce((a, b) => a + b, 0);
    initialCostScoreArray = initialCostScoreArray.reduce((a, b) => a + b, 0);

    // return added up points of answered questions
    return {
      menuScore: menuScoreArray,
      operationScore: operatingScoreArray,
      initialCostScore: initialCostScoreArray,
    };
  }

  //   private async __apply_c_score(
  //     sScoreData: SScoreDelivery[] | SScoreRestaurant[],
  //     questionScore: any,
  //     cScoreAttribute: CScoreAttribute,
  //   ): Promise<SScoreDelivery[] | SScoreRestaurant[]> {
  //       sScoreData.map(data => {

  //       })
  //   }
}
