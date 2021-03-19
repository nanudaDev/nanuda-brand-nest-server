import { Injectable } from '@nestjs/common';
import { CompressionTypes } from '@nestjs/common/interfaces/external/kafka-options.interface';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { Console } from 'console';
import { of } from 'rxjs';
import { DeliverySpaceConversion, ScoreConversionUtil } from 'src/common/utils';
import { BaseDto, BaseService } from 'src/core';
import {
  FNB_OWNER,
  KB_MEDIUM_CATEGORY,
  OPERATION_TIME,
  REVENUE_RANGE,
} from 'src/shared';
import {
  AdvancedConsoleLogger,
  EntityManager,
  getConnection,
  Repository,
} from 'typeorm';
import { CommonCode } from '../common-code/common-code.entity';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { LocationAnalysisService } from '../data/location-analysis/location-analysis.service';
import { ProformaConsultResult } from '../proforma-consult-result/proforma-consult-result.entity';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';
import { QuestionProformaMapper } from '../question-proforma-mapper/question-proforma-mapper.entity';
import { AggregateResultResponseBackup } from './aggregate-result-response-backup.entity';
import { AggregateResultResponse } from './aggregate-result-response.entity';
import { AggregateResultResponseQueryDto } from './dto';
import { OperationSentenceResponse } from './operation-sentence-response.entity';

export class Graph {
  labels: any;
  datasets: GraphData[];
}

export class GraphData {
  data: any;
  label: string;
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean;
}
class DeliveryRestaurantRatioClass extends BaseDto<
  DeliveryRestaurantRatioClass
> {
  deliveryRatio: number;
  deliveryRevenue: number;
  mediumCategoryName: string;
  offlineRatio: number;
  offlineRevenue: number;
}

export class ResponseWithProformaId extends BaseDto<ResponseWithProformaId> {
  proformaId: number;
  responses: ResponseArrayClass[];
  operationSentenceResponse?: string;
  completeTimeData?: any;
  newFnbOwnerPieChartData?: any;
  curFnbOwnerLineChartData?: any;
}

export class ResponseArrayClass extends BaseDto<ResponseArrayClass> {
  operationTime: OPERATION_TIME;
  modifiedResponse?: string;
  koreanPrefSentence: string;
  modifiedSufSentence: string;
}

class LineGraphData {
  data: number;
  pointRadius: number;
  pointHoverRadius: number;
  pointBackgroundColor: string | 'grey';
  label: string;
}

@Injectable()
export class AggregateResultResponseService extends BaseService {
  constructor(
    @InjectRepository(AggregateResultResponse)
    private readonly responseRepo: Repository<AggregateResultResponse>,
    @InjectRepository(ConsultResult)
    private readonly consultResultRepo: Repository<ConsultResult>,
    @InjectRepository(ProformaConsultResult)
    private readonly proformaConsultRepo: Repository<ProformaConsultResult>,
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
    const averageRatioArray: number[] = [];
    Object.keys(deliveryRatioData).forEach(function(key) {
      if (deliveryRatioData[key].deliveryRatio === null) {
        deliveryRatioData[key].deliveryRatio = 0;
      }
      averageRatioArray.push(deliveryRatioData[key].deliveryRatio);
    });
    const average =
      averageRatioArray.reduce((prev, curr) => prev + curr) /
      averageRatioArray.length;
    console.log(average);
    // const deliveryRatioGradeFilteredByCategory = new DeliveryRestaurantRatioClass(
    //   deliveryRatioData[aggregateQuestionQuery.kbFoodCategory],
    // );
    // if (!deliveryRatioGradeFilteredByCategory.deliveryRatio) {
    //   deliveryRatioData.deliveryRatio = 0;
    // }
    const deliveryRatioGrade = DeliverySpaceConversion(average);
    const scoreCard = ScoreConversionUtil(aggregateQuestionQuery);
    scoreCard.deliveryRatioGrade = deliveryRatioGrade.grade;
    // get for each time slot
    const forEachTimeSlot = await Axios.get(
      `${this.analysisUrl}location-hour-medium-small-category`,
      {
        params: { hdongCode: aggregateQuestionQuery.hdongCode },
      },
    );
    console.log(scoreCard);
    const responseGet = this.responseRepo
      .createQueryBuilder('response')
      .AndWhereEqual('response', 'ageGroupGrade', scoreCard.ageGroupGrade, null)
      // .AndWhereEqual(
      //   'response',
      //   'deliveryRatioGrade',
      //   scoreCard.deliveryRatioGrade,
      //   null,
      // )
      // .AndWhereEqual('response', 'isReadyGrade', scoreCard.isReadyGrade, null)
      .AndWhereLike('response', 'fnbOwnerStatus', scoreCard.fnbOwnerStatus);
    if (scoreCard.revenueRangeGrade) {
      responseGet.AndWhereEqual(
        'response',
        'revenueRangeGrade',
        scoreCard.revenueRangeGrade,
        null,
      );
    }
    if (scoreCard.isReadyGrade) {
      responseGet.AndWhereEqual(
        'response',
        'isReadyGrade',
        scoreCard.isReadyGrade,
        null,
      );
    }
    const response = await responseGet.getOne();
    const responseArray = [];
    const returningResponse = await this.entityManager.transaction(
      async entityManager => {
        await Promise.all(
          aggregateQuestionQuery.operationTimes.map(async times => {
            if (times === OPERATION_TIME.BREAKFAST) {
              // codes
              const codes: any =
                forEachTimeSlot.data[0][deliveryRatioGrade.key][0];
              response.response = response.response.replace(
                'MEDIUM_CODE',
                codes.medium_category_nm,
              );
              response.response = response.response.replace(
                'SMALL_CODE',
                codes.medium_small_category_nm,
              );
              const newResponse = new ResponseArrayClass({
                operationTime: OPERATION_TIME.BREAKFAST,
                modifiedResponse: response,
                koreanPrefSentence: '아침에는',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
            if (times === OPERATION_TIME.LUNCH) {
              // codes
              const codes: any =
                forEachTimeSlot.data[0][deliveryRatioGrade.key][0];
              response.response = response.response.replace(
                'MEDIUM_CODE',
                codes.medium_category_nm,
              );
              response.response = response.response.replace(
                'SMALL_CODE',
                codes.medium_small_category_nm,
              );
              const newResponse = new ResponseArrayClass({
                operationTime: OPERATION_TIME.LUNCH,
                modifiedResponse: response,
                koreanPrefSentence: '점심에는',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
            if (times === OPERATION_TIME.DINNER) {
              // codes
              const codes: any =
                forEachTimeSlot.data[0][deliveryRatioGrade.key][0];
              response.response = response.response.replace(
                'MEDIUM_CODE',
                codes.medium_category_nm,
              );
              response.response = response.response.replace(
                'SMALL_CODE',
                codes.medium_small_category_nm,
              );
              const newResponse = new ResponseArrayClass({
                operationTime: OPERATION_TIME.DINNER,
                modifiedResponse: response,
                koreanPrefSentence: '저녁에는',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
            if (times === OPERATION_TIME.LATE_NIGHT) {
              // codes
              const codes: any =
                forEachTimeSlot.data[0][deliveryRatioGrade.key][0];
              response.response = response.response.replace(
                'MEDIUM_CODE',
                codes.medium_category_nm,
              );
              response.response = response.response.replace(
                'SMALL_CODE',
                codes.medium_small_category_nm,
              );
              const newResponse = new ResponseArrayClass({
                operationTime: OPERATION_TIME.LATE_NIGHT,
                modifiedResponse: response,
                koreanPrefSentence: '야식 시간대에는',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
          }),
        );
        // find operation sentence
        const operationSentence = await entityManager
          .getRepository(OperationSentenceResponse)
          .findOne({
            where: {
              deliveryRatioGrade: scoreCard.deliveryRatioGrade,
              ageGroupGrade: response.ageGroupGrade,
              fnbOwnerStatus: response.fnbOwnerStatus,
            },
          });
        // save to proforma consult table
        const newProforma = new ProformaConsultResult(aggregateQuestionQuery);
        newProforma.aggregateResponseId = response.id;
        newProforma.ageGroupGrade = response.ageGroupGrade;
        newProforma.revenueRangeGrade = response.revenueRangeGrade;
        newProforma.isReadyGrade = response.isReadyGrade;
        newProforma.operationSentenceId = operationSentence.id;
        newProforma.deliveryRatioGrade = response.deliveryRatioGrade;
        newProforma.selectedKbMediumCategory =
          aggregateQuestionQuery.kbFoodCategory;
        newProforma.operationTimesResult = responseArray;
        await entityManager.save(newProforma);
        await Promise.all(
          aggregateQuestionQuery.questionGivenArray.map(async question => {
            let newProformaMapper = new QuestionProformaMapper();
            newProformaMapper.proformaConsultResultId = newProforma.id;
            newProformaMapper.questionId = question.questionId;
            newProformaMapper = await entityManager.save(newProformaMapper);
            // create question given mapper
            await Promise.all(
              question.givenId.map(async given => {
                let newGivenMapper = new QuestionProformaGivenMapper();
                newGivenMapper.proformaConsultResultId = newProforma.id;
                newGivenMapper.questionId = question.questionId;
                newGivenMapper.givenId = given;
                newGivenMapper.questionProformaMapperId = newProformaMapper.id;
                newGivenMapper = await entityManager.save(newGivenMapper);
              }),
            );
          }),
        );
        const returnResponse = new ResponseWithProformaId();
        returnResponse.proformaId = newProforma.id;
        returnResponse.responses = responseArray;
        returnResponse.operationSentenceResponse = operationSentence.response;
        returnResponse.completeTimeData = forEachTimeSlot.data;
        if (scoreCard.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER) {
          returnResponse.newFnbOwnerPieChartData = await this.__get_pie_chart_data(
            deliveryRatioData,
          );
        }
        if (scoreCard.fnbOwnerStatus === FNB_OWNER.CUR_FNB_OWNER) {
          returnResponse.curFnbOwnerLineChartData = await this.__get_line_chart_data(
            aggregateQuestionQuery.hdongCode,
            aggregateQuestionQuery.revenueRangeCode,
          );
        }
        return returnResponse;
      },
    );
    return returningResponse;
  }

  /**
   * aggregate question
   * @param aggregateQuestionQuery
   */
  async findResponse(aggregateQuestionQuery?: AggregateResultResponseQueryDto) {
    const responseArray: ResponseArrayClass[] = [];
    // 시간대별로 데이터 호출
    const forEachTimeSlot = await Axios.get(
      `${this.analysisUrl}location-hour-medium-small-category`,
      {
        params: { hdongCode: aggregateQuestionQuery.hdongCode },
      },
    );
    const deliveryRatioData = await this.locationAnalysisService.locationInfoDetail(
      aggregateQuestionQuery.hdongCode,
    );
    // await Promise.all(
    //   aggregateQuestionQuery.operationTimes.map(async time => {
    //     if (time === OPERATION_TIME.BREAKFAST) {
    //     }
    //   }),
    // );

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

  /**
   * get pie chart data for new fnb owners
   * TODO: REFACTORING NEEDED
   * @param hdongCode
   */
  private async __get_pie_chart_data(analyzedData: any) {
    console.log(analyzedData);
    const chartData = new Graph();
    const tempLabels = [];
    const tempData = [];
    const datasets = [];
    chartData.datasets = datasets;
    // const newFnbOwnerModel = new GraphData();
    Object.keys(analyzedData).forEach(function(key) {
      tempLabels.push(analyzedData[key].mediumCategoryName);
      tempData.push(Math.round(analyzedData[key].totalRevenue));
    });
    const labels = tempLabels.slice(0, 5);
    const preAveragedDataArray = tempData.slice(0, 5);
    const totalForTheArea = preAveragedDataArray.reduce(
      (prev, cur) => prev + cur,
    );
    const appliedAveragePercentage = [];
    preAveragedDataArray.map(revenue => {
      const value = Math.round((revenue / totalForTheArea) * 100);
      appliedAveragePercentage.push(value);
    });
    const data = appliedAveragePercentage;
    const backgroundColor = [
      'rgb(0, 77, 138)',
      'rgb(108, 143, 183)',
      'rgb(167, 189, 211)',
      'rgb(208, 220, 232)',
      'rgb(245, 245, 245)',
    ];
    datasets.push({ data: data, backgroundColor: backgroundColor });
    return { labels, datasets };
  }

  private async __get_line_chart_data(
    hdongCode: string,
    selectedRevenue: REVENUE_RANGE,
  ) {
    let averageMyRevenue;
    if (selectedRevenue === REVENUE_RANGE.UNDER_THOUSAND) {
      averageMyRevenue = 7500000;
    } else if (selectedRevenue === REVENUE_RANGE.BETWEEN_ONE_AND_TWO) {
      averageMyRevenue = 15000000;
    } else if (selectedRevenue === REVENUE_RANGE.BETWEEN_TWO_AND_THREE) {
      averageMyRevenue = 25000000;
    } else if (selectedRevenue === REVENUE_RANGE.BETWEEN_THREE_AND_FIVE) {
      averageMyRevenue = 40000000;
    } else if (selectedRevenue === REVENUE_RANGE.ABOVE_FIVE_THOUSAND) {
      averageMyRevenue = 50000000;
    }
    const revenueData = await this.locationAnalysisService.getRevenueForLocation(
      { hdongCode: hdongCode },
    );
    const averageRevenueForLocation =
      revenueData.value.reduce((prev, cur) => prev + cur) / 2;

    const sortArray = [];
    // 내 매출
    const myRevenue: LineGraphData = {
      data: averageMyRevenue,
      pointHoverRadius: 20,
      label: '내 매출',
      pointBackgroundColor: 'blue',
      pointRadius: 15,
    };
    // 최저매출
    const lowestRevenue: LineGraphData = {
      data: revenueData.value[0],
      label: '최저매출',
      pointBackgroundColor: 'grey',
      pointHoverRadius: 5,
      pointRadius: 5,
    };
    // 평균 매출
    const averageRevenue: LineGraphData = {
      data: averageRevenueForLocation,
      label: '평균매출',
      pointBackgroundColor: 'grey',
      pointHoverRadius: 5,
      pointRadius: 5,
    };
    // 최고 매출
    const highestRevenue: LineGraphData = {
      data: revenueData.value[1],
      label: '최고매출',
      pointBackgroundColor: 'grey',
      pointHoverRadius: 5,
      pointRadius: 5,
    };
    // first graph
    const firstGraphPart: LineGraphData = {
      data: lowestRevenue.data - 1000000,
      label: '',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointBackgroundColor: 'grey',
    };
    const endGraphPart: LineGraphData = {
      data: highestRevenue.data + 20000000,
      label: '',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointBackgroundColor: 'grey',
    };
    sortArray.push(
      myRevenue,
      lowestRevenue,
      averageRevenue,
      highestRevenue,
      firstGraphPart,
      endGraphPart,
    );
    const modifiedArray: LineGraphData[] = sortArray.sort((a, b) =>
      a.data > b.data ? -1 : 1,
    );
    const graph = new Graph();
    const labels = [];
    graph.labels = labels;
    const datasets = [];
    graph.datasets = datasets;
    const data = [];
    const pointRadius = [];
    const pointHoverRadius = [];
    const pointBackgroundColor = [];
    modifiedArray.map(graphData => {
      labels.push(graphData.label);
      data.push(graphData.data);
      pointRadius.push(graphData.pointRadius);
      pointBackgroundColor.push(graphData.pointBackgroundColor);
      pointHoverRadius.push(graphData.pointHoverRadius);
      datasets.push();
    });
    datasets.push({
      data,
      pointRadius,
      pointHoverRadius,
      pointBackgroundColor,
    });

    return graph;
  }
}
