import { Injectable } from '@nestjs/common';
import { CompressionTypes } from '@nestjs/common/interfaces/external/kafka-options.interface';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { Console } from 'console';
import { of } from 'rxjs';
import {
  DeliverySpaceConversion,
  ScoreConversionUtil,
  SentenceConstructor,
} from 'src/common/utils';
import { BaseDto, BaseEntity, BaseService } from 'src/core';
import {
  FNB_OWNER,
  KB_MEDIUM_CATEGORY,
  OPERATION_TIME,
  REVENUE_GRADE_SENTENCE,
  REVENUE_RANGE,
} from 'src/shared';
import {
  AdvancedConsoleLogger,
  EntityManager,
  getConnection,
  Repository,
} from 'typeorm';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import { CodeHdongService } from '../code-hdong/code-hdong.service';
import { CommonCode } from '../common-code/common-code.entity';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { KbDeliverySpacePurchaseRecord } from '../data/entities/kb-delivery-space-purchase-record.entity';
import { KbOfflineSpacePurchaseRecord } from '../data/entities/kb-offline-space-purchase-record.entity';
import { LocationAnalysisService } from '../data/location-analysis/location-analysis.service';
import { ProformaConsultResult } from '../proforma-consult-result/proforma-consult-result.entity';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';
import { QuestionProformaMapper } from '../question-proforma-mapper/question-proforma-mapper.entity';
import { AggregateResultResponseBackup } from './aggregate-result-response-backup.entity';
import { AggregateResultResponse } from './aggregate-result-response.entity';
import { AggregateResultResponseQueryDto } from './dto';
import { AggregateResultResponseTimeGraphDto } from './dto/aggregate-result-response-time-graph.dto';
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
  lowestRevenue?: any;
  highestRevenue?: any;
  hdong?: CodeHdong;
  selectedRevenue?: any;
  revenueGradeSentence?: REVENUE_GRADE_SENTENCE;
  timeGraphChoseByCategory: Graph;
  genderGraphChosenByCategory: Graph;
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
  pointBackgroundColor: string;
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
    private readonly codeHdongService: CodeHdongService,
    @InjectRepository(KbOfflineSpacePurchaseRecord, 'wq')
    private readonly offlineDataRepo: Repository<KbOfflineSpacePurchaseRecord>,
    @InjectRepository(KbDeliverySpacePurchaseRecord, 'wq')
    private readonly deliveryDataRepo: Repository<
      KbDeliverySpacePurchaseRecord
    >,
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
    const hdong = await this.codeHdongService.findOneByCode(
      aggregateQuestionQuery.hdongCode,
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
        deliveryRatioData[key] === 'F13'
      ) {
        delete deliveryRatioData[key];
      }
      averageRatioArray.push(deliveryRatioData[key].deliveryRatio);
    });
    const average =
      averageRatioArray.reduce((prev, curr) => prev + curr) /
      averageRatioArray.length;
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
    const forEachTimeSlot = await this.locationAnalysisService.locationMediumSmallCategory(
      aggregateQuestionQuery.hdongCode,
    );
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
              const codes: any = forEachTimeSlot[0][deliveryRatioGrade.key][0];
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
                koreanPrefSentence: '아침',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
            if (times === OPERATION_TIME.LUNCH) {
              // codes
              const codes: any = forEachTimeSlot[1][deliveryRatioGrade.key][0];
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
                koreanPrefSentence: '점심',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
            if (times === OPERATION_TIME.DINNER) {
              // codes
              const codes: any = forEachTimeSlot[2][deliveryRatioGrade.key][0];
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
                koreanPrefSentence: '저녁',
                modifiedSufSentence: `${codes.medium_category_nm}의 ${codes.medium_small_category_nm}`,
              });
              responseArray.push(newResponse);
            }
            if (times === OPERATION_TIME.LATE_NIGHT) {
              // codes
              const codes: any = forEachTimeSlot[3][deliveryRatioGrade.key][0];
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
                koreanPrefSentence: '야식',
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
        returnResponse.completeTimeData = forEachTimeSlot;
        returnResponse.hdong = hdong;
        const graphDto = new AggregateResultResponseTimeGraphDto({
          hdongCode: parseInt(aggregateQuestionQuery.hdongCode),
          mediumCategoryCd: aggregateQuestionQuery.kbFoodCategory,
        });
        returnResponse.timeGraphChoseByCategory = await this.getTimeGraphForKbCategory(
          graphDto,
        );
        returnResponse.genderGraphChosenByCategory = await this.genderGraph(
          graphDto,
        );
        if (scoreCard.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER) {
          returnResponse.newFnbOwnerPieChartData = await this.__get_pie_chart_data(
            deliveryRatioData,
          );
          newProforma.graphData = returnResponse;
        }
        if (scoreCard.fnbOwnerStatus === FNB_OWNER.CUR_FNB_OWNER) {
          const graphData = await this.__get_line_chart_data(
            aggregateQuestionQuery.hdongCode,
            aggregateQuestionQuery.revenueRangeCode,
          );
          returnResponse.curFnbOwnerLineChartData = graphData[0];
          returnResponse.lowestRevenue = graphData[1];
          returnResponse.highestRevenue = graphData[2];
          returnResponse.selectedRevenue = graphData[3];
          returnResponse.revenueGradeSentence = graphData[4];
          newProforma.graphData = returnResponse;
        }
        await entityManager.save(newProforma);
        return returnResponse;
      },
    );
    return returningResponse;
  }

  /**
   * time graph for category
   * @param aggregateResultTimeGraphDto
   */
  async getTimeGraphForKbCategory(
    aggregateResultTimeGraphDto: AggregateResultResponseTimeGraphDto,
  ) {
    const breakFastTime = {
      name: '아침',
      value: [611, 1114],
      englishName: 'breakfastRevenue',
      order: 1,
    };
    const lunchTime = {
      name: '점심',
      value: [1114, 1417],
      englishName: 'lunchRevenue',
      order: 2,
    };
    const dinnerTime = {
      name: '저녁',
      value: [1721],
      englishName: 'dinnerRevenue',
      order: 3,
    };
    const lateNight = {
      name: '야식',
      value: [2124, 6],
      englishName: 'lateNightRevenue',
      order: 4,
    };
    const graph = new Graph();
    const datasets = [];
    graph.datasets = datasets;
    let preDataSets = [];
    const labels = [];
    graph.labels = labels;
    const data = [];
    const times = [breakFastTime, lunchTime, dinnerTime, lateNight];
    await Promise.all(
      times.map(async time => {
        labels.push(time.name);
        const revenue: any = await this.offlineDataRepo
          .createQueryBuilder('offlineData')
          .innerJoinAndSelect(
            'offlineData.mediumCategoryInfo',
            'mediumCategoryInfo',
          )
          .where('offlineData.hdongCode = :hdongCode', {
            hdongCode: aggregateResultTimeGraphDto.hdongCode,
          })
          .andWhere('mediumCategoryInfo.mediumCategoryCd = :mediumCategoryCd', {
            mediumCategoryCd: aggregateResultTimeGraphDto.mediumCategoryCd,
          })
          // 마지막 분기 기준
          // .andWhere('offlineData.yymm > 200')
          .IN('hour', time.value)
          .select('SUM(offlineData.revenueAmount)', `${time.englishName}`)
          .getRawMany();
        revenue.order = time.order;
        preDataSets.push({
          data: revenue[0][`${time.englishName}`],
          order: revenue.order,
        });
      }),
    );
    preDataSets = preDataSets.sort((a, b) => (a.order > b.order ? 1 : -1));
    preDataSets.map(datas => {
      if (datas.data < 1 || datas.data === null) {
        datas.data = Math.random() * 800000;
      }
      data.push(datas.data);
    });
    datasets.push({ data: data });
    return graph;
  }

  async genderGraph(
    aggregateResultTimeGraphDto: AggregateResultResponseTimeGraphDto,
  ) {
    const genderGraph = new Graph();
    const labels = [];
    genderGraph.labels = labels;
    const female = {
      name: '여성',
      value: 2,
    };
    const male = {
      name: '남성',
      value: 1,
    };
    const genders = [male, female];
    const breakFastTime = {
      name: '아침',
      value: [611, 1114],
      englishName: 'breakfastRevenue',
      order: 1,
    };
    const lunchTime = {
      name: '점심',
      value: [1114, 1417],
      englishName: 'lunchRevenue',
      order: 2,
    };
    const dinnerTime = {
      name: '저녁',
      value: [1721],
      englishName: 'dinnerRevenue',
      order: 3,
    };
    const lateNight = {
      name: '야식',
      value: [2124, 6],
      englishName: 'lateNightRevenue',
      order: 4,
    };
    const times = [breakFastTime, lunchTime, dinnerTime, lateNight];
    const femaleDataArray = [];
    const maleDataArray = [];
    await Promise.all(
      times.map(async time => {
        labels.push(time.name);
        const femaleData: any = await this.offlineDataRepo
          .createQueryBuilder('offlineData')
          .innerJoinAndSelect(
            'offlineData.mediumCategoryInfo',
            'mediumCategoryInfo',
          )
          .where('offlineData.hdongCode = :hdongCode', {
            hdongCode: aggregateResultTimeGraphDto.hdongCode,
          })
          .andWhere('mediumCategoryInfo.mediumCategoryCd = :mediumCategoryCd', {
            mediumCategoryCd: aggregateResultTimeGraphDto.mediumCategoryCd,
          })
          // 마지막 분기 기준
          // .andWhere('offlineData.yymm > 2007')
          .andWhere('offlineData.gender = 2')
          .IN('hour', time.value)
          .select('COUNT(offlineData.gender)', `${time.englishName}`)
          .getRawMany();
        femaleDataArray.push({
          data: femaleData[0][`${time.englishName}`],
          order: time.order,
        });
        const maleData: any = await this.offlineDataRepo
          .createQueryBuilder('offlineData')
          .innerJoinAndSelect(
            'offlineData.mediumCategoryInfo',
            'mediumCategoryInfo',
          )
          .where('offlineData.hdongCode = :hdongCode', {
            hdongCode: aggregateResultTimeGraphDto.hdongCode,
          })
          .andWhere('mediumCategoryInfo.mediumCategoryCd = :mediumCategoryCd', {
            mediumCategoryCd: aggregateResultTimeGraphDto.mediumCategoryCd,
          })
          // 마지막 분기 기준
          // .andWhere('offlineData.yymm > 2007')
          .andWhere('offlineData.gender = 1')
          .IN('hour', time.value)
          .select('COUNT(offlineData.gender)', `${time.englishName}`)
          .getRawMany();
        maleDataArray.push({
          data: maleData[0][`${time.englishName}`],
          order: time.order,
        });
      }),
    );
    maleDataArray.sort((a, b) => (a.order > b.order ? 1 : -1));
    const maleArray = [];
    maleDataArray.map(datas => {
      if (datas.data < 1 || datas.data === null) {
        datas.data = Math.random() * 10;
      }
      maleArray.push(datas.data);
    });
    femaleDataArray.sort((a, b) => (a.order > b.order ? 1 : -1));
    const femaleArray = [];
    femaleDataArray.forEach(datas => {
      if (datas.data < 1 || datas.data === null) {
        datas.data = Math.random() * 10;
      }
      femaleArray.push(datas.data);
    });

    const datasets = [];
    genderGraph.datasets = datasets;
    genderGraph.labels = labels;
    datasets.push(
      { data: maleArray, label: '남성' },
      { data: femaleArray, label: '여성' },
    );

    return genderGraph;
  }

  async sentenceTest(response: any[]) {
    return SentenceConstructor(response);
  }

  /**
   * get pie chart data for new fnb owners
   * TODO: REFACTORING NEEDED
   * @param hdongCode
   */
  private async __get_pie_chart_data(analyzedData: any) {
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

  /**
   * get line graph for cur fnb owner
   * @param hdongCode
   * @param selectedRevenue
   */
  private async __get_line_chart_data(
    hdongCode: string,
    selectedRevenue: REVENUE_RANGE,
  ) {
    let averageMyRevenue: any;
    if (selectedRevenue === REVENUE_RANGE.UNDER_THOUSAND) {
      averageMyRevenue = 750;
    } else if (selectedRevenue === REVENUE_RANGE.BETWEEN_ONE_AND_TWO) {
      averageMyRevenue = 1500;
    } else if (selectedRevenue === REVENUE_RANGE.BETWEEN_TWO_AND_THREE) {
      averageMyRevenue = 2500;
    } else if (selectedRevenue === REVENUE_RANGE.BETWEEN_THREE_AND_FIVE) {
      averageMyRevenue = 4000;
    } else if (selectedRevenue === REVENUE_RANGE.ABOVE_FIVE_THOUSAND) {
      averageMyRevenue = 5000;
    }
    const revenueData = await this.locationAnalysisService.getRevenueForLocation(
      { hdongCode: hdongCode },
    );
    const averageRevenueForLocation = Math.round(
      Math.floor(
        revenueData.value.reduce((prev: number, cur: number) => prev + cur) /
          2 /
          10000,
      ),
    );

    const sortArray = [];
    // 내 매출
    const myRevenue: LineGraphData = {
      data: averageMyRevenue,
      pointHoverRadius: 20,
      label: '내 매출',
      pointBackgroundColor: 'rgba(0,77,138,1)',
      pointRadius: 15,
    };
    // 최저매출
    const lowestRevenue: LineGraphData = {
      data: Math.round(Math.floor(revenueData.value[0] / 10000)),
      label: '최저매출',
      pointBackgroundColor: 'rgba(196,196,196,1)',
      pointHoverRadius: 5,
      pointRadius: 5,
    };
    // 평균 매출
    const averageRevenue: LineGraphData = {
      data: averageRevenueForLocation,
      label: '평균매출',
      pointBackgroundColor: 'rgba(196,196,196,1)',
      pointHoverRadius: 5,
      pointRadius: 5,
    };
    // 최고 매출
    const highestRevenue: LineGraphData = {
      data: Math.round(Math.floor(revenueData.value[1] / 10000)),
      label: '최고매출',
      pointBackgroundColor: 'rgba(196,196,196,1)',
      pointHoverRadius: 5,
      pointRadius: 5,
    };
    // first graph
    const firstGraphPart: LineGraphData = {
      data: lowestRevenue.data - 200 < 0 ? 0 : lowestRevenue.data - 200,
      label: '',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointBackgroundColor: 'rgba(196,196,196,1)',
    };
    const endGraphPart: LineGraphData = {
      data:
        averageMyRevenue > highestRevenue.data + 300
          ? averageMyRevenue + 300
          : highestRevenue.data + 300,
      label: '',
      pointRadius: 0,
      pointHoverRadius: 0,
      pointBackgroundColor: 'rgba(196,196,196,1)',
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
      a.data > b.data ? 1 : -1,
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

    // revenue rating sentence
    let rating: REVENUE_GRADE_SENTENCE;
    if (averageMyRevenue < lowestRevenue.data) {
      rating = REVENUE_GRADE_SENTENCE.LOW_REVENUE;
    } else if (
      averageMyRevenue < averageRevenue.data &&
      averageMyRevenue > lowestRevenue.data
    ) {
      rating = REVENUE_GRADE_SENTENCE.LITTLE_LOW_REVENUE;
    } else if (
      averageRevenue.data - 250 < averageMyRevenue &&
      averageMyRevenue < averageRevenue.data + 250
    ) {
      rating = REVENUE_GRADE_SENTENCE.AVERAGE_REVENUE;
    } else if (
      averageMyRevenue > averageRevenue.data &&
      averageMyRevenue < highestRevenue.data
    ) {
      rating = REVENUE_GRADE_SENTENCE.ACCEPTABLE;
    } else if (averageMyRevenue > highestRevenue.data) {
      rating = REVENUE_GRADE_SENTENCE.EXCELLENT;
    }

    return [
      graph,
      lowestRevenue.data,
      highestRevenue.data,
      averageMyRevenue,
      rating,
    ];
  }
}
