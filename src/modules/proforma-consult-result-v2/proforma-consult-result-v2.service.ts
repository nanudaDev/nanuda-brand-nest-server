import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DELIVERY_GRADE_TYPE, RESTAURANT_TYPE, YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { FNB_OWNER, KB_FOOD_CATEGORY, QUESTION_TYPE } from 'src/shared';
import { EntityManager, Repository } from 'typeorm';
import { QuestionGivenArrayClass } from '../aggregate-result-response/dto';
import { CodeHdongService } from '../code-hdong/code-hdong.service';
import { CScoreAttribute, SScoreDelivery, SScoreRestaurant } from '../data';
import { CScoreService } from '../data/c-score/c-score.service';
import { LocationAnalysisService } from '../data/location-analysis/location-analysis.service';
import { SScoreService } from '../data/s-score/s-score.service';
import { QuestionGivenV2 } from '../question-given-v2/question-given-v2.entity';
import { QuestionProformaMapperV2 } from '../question-proforma-mapper-v2/question-proforma-mapper-v2.entity';
import { QuestionV2Tracker } from '../question-tracker-v2/question-tracker-v2.entity';
import { QuestionV2 } from '../question-v2/question-v2.entity';
import { ProformaConsultResultV2QueryDto } from './dto';
import { ProformaConsultResultV2 } from './proforma-consult-result-v2.entity';
import Axios from 'axios';
import { ModifiedRevenueTracker } from '../modified-revenue-tracker/modified-revenue-tracker.entity';
import {
  RandomRevenueGenerator,
  RandomTrajectoryGenerator,
} from 'src/common/utils';
import { ModifiedTrajectoryTracker } from '../modified-trajectory-tracker/modified-trajectory-tracker.entity';
import { ProformaEventTrackerService } from '../proforma-event-tracker/proforma-event-tracker.service';
import { AdminProformaConsultResultV2ListDto } from './dto/admin-proforma-consult-result-v2-list.dto';
import { ConsultResultV2 } from '../consult-result-v2/consult-result-v2.entity';
import { SScoreListDto } from '../data/s-score/dto/s-score-list.dto';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../common/interfaces/pagination.type';

class CScoreAggregateClass {
  menuscore: number;
  operationScore: number;
  initialCostScore: number;
}

// for new fnb owner
// May 17 2021
class ProformaConsultV2ResponseClass {
  menuRecommedations: any;
  deliveryRatio?: any;
  // revenueData?: any;
  otherMenuRecommendations?: any;
}

// for cur fnb owner
// May 17 2021
class ProformaConsultResultV2ResponseClassForCurFnbOwer {
  selectedMenuRecommendation?: SScoreRestaurant | SScoreDelivery;
  deliveryRatio?: number;
  otherMenuRecommendations?: SScoreRestaurant[] | SScoreDelivery[];
  estimatedRevenue?: number;
  hdong?: CodeHdong;
  id?: number;
  deliveryOrRestaurantType?: DELIVERY_GRADE_TYPE;
}

@Injectable()
export class ProformaConsultResultV2Service extends BaseService {
  constructor(
    @InjectRepository(ProformaConsultResultV2)
    private readonly proformaConsultRepo: Repository<ProformaConsultResultV2>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly locationAnalysisService: LocationAnalysisService,
    private readonly cScoreService: CScoreService,
    private readonly codeHdongService: CodeHdongService,
    private readonly sScoreService: SScoreService,
    private readonly proformaEventTrackerService: ProformaEventTrackerService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminProformaConsultResultV2ListDto
   * @param pagination
   * @returns
   */
  async findAllForAdmin(
    adminProformaConsultResultV2ListDto: AdminProformaConsultResultV2ListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProformaConsultResultV2>> {
    const qb = this.proformaConsultRepo
      .createQueryBuilder('proforma')
      .CustomInnerJoinAndSelect(['fnbOwnerCodeStatus', 'cScoreAttribute'])
      .AndWhereLike(
        'proforma',
        'fnbOwnerStatus',
        adminProformaConsultResultV2ListDto.fnbOwnerStatus,
        adminProformaConsultResultV2ListDto.exclude('fnbOwnerStatus'),
      )
      .AndWhereLike(
        'proforma',
        'isConsultYn',
        adminProformaConsultResultV2ListDto.isConsultYn,
        adminProformaConsultResultV2ListDto.exclude('isConsultYn'),
      )
      .AndWhereLike(
        'proforma',
        'selectedKbMediumCategory',
        adminProformaConsultResultV2ListDto.selectedKbMediumCategory,
        adminProformaConsultResultV2ListDto.exclude('selectedKbMediumCategory'),
      );
    if (adminProformaConsultResultV2ListDto.hdongCode) {
      qb.AndWhereEqual(
        'proforma',
        'hdongCode',
        adminProformaConsultResultV2ListDto.hdongCode,
        adminProformaConsultResultV2ListDto.exclude('hdongCode'),
      );
    }
    qb.Paginate(pagination);
    qb.WhereAndOrder(adminProformaConsultResultV2ListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * proforma find one
   * @param id
   */
  async findOneForAdmin(id: number): Promise<ProformaConsultResultV2> {
    const qb = await this.proformaConsultRepo
      .createQueryBuilder('proforma')
      // .CustomLeftJoinAndSelect(['consult'])
      .CustomInnerJoinAndSelect(['fnbOwnerCodeStatus', 'cScoreAttribute'])
      .where('proforma.id = :id', { id: id })
      .getOne();

    /**
     * if has consult
     */
    if (qb.isConsultYn === YN.YES) {
      qb.consult = await this.entityManager
        .getRepository(ConsultResultV2)
        .findOne({ proformaConsultResultId: qb.id });
    }
    if (qb.fnbOwnerStatus === FNB_OWNER.CUR_FNB_OWNER) {
      const newSscoreDto = new SScoreListDto();
      newSscoreDto.hdongCode = Number(qb.hdongCode);
      newSscoreDto.mediumCategoryCode = qb.selectedKbMediumCategory;
      const otherMenuRecommendations = await this.sScoreService.findSecondarySScore(
        newSscoreDto,
        qb.deliveryRatioData.deliveryRatio < 20
          ? RESTAURANT_TYPE.RESTAURANT
          : RESTAURANT_TYPE.DELIVERY,
      );
      qb.otherMenuRecommendations = otherMenuRecommendations;
    }
    return qb;
  }

  /**
   * create proforma for user
   * @param proformaConsultResultQueryDto
   * @returns
   */
  async findResponseToQuestion(
    proformaConsultResultQueryDto: ProformaConsultResultV2QueryDto,
  ) {
    // add latest question to question tracker
    const lastQuestion = proformaConsultResultQueryDto.questionGivenArray.slice(
      -1,
    )[0];
    const lastTracker = new QuestionV2Tracker();
    lastTracker.ipAddress = proformaConsultResultQueryDto.ipAddress;
    lastTracker.questionId = lastQuestion.questionId;
    lastTracker.isLastQuestion = YN.YES;
    lastTracker.userType = proformaConsultResultQueryDto.fnbOwnerStatus;
    lastTracker.uniqueSessionId = proformaConsultResultQueryDto.uniqueSessionId;
    lastTracker.givenId = lastQuestion.givenId;
    await this.entityManager.getRepository(QuestionV2Tracker).save(lastTracker);

    //   latest c-score attribute value
    const cScoreAttributeValue = await this.cScoreService.findValid();
    const deliveryRatioData = await this.locationAnalysisService.locationInfoDetail(
      proformaConsultResultQueryDto.hdongCode,
    );
    // 평균 배달 및 홀 비중
    const averageRatioArray: number[] = [];
    Object.keys(deliveryRatioData).forEach(function(key) {
      if (deliveryRatioData[key].deliveryRatio === null) {
        deliveryRatioData[key].deliveryRatio = 0;
      }
      // if (
      //   deliveryRatioData[key] === 'F05' ||
      //   deliveryRatioData[key] === 'F08' ||
      //   deliveryRatioData[key] === 'F09' ||
      //   deliveryRatioData[key] === 'F13' ||
      //   deliveryRatioData[key] === 'F03'
      // ) {
      //   delete deliveryRatioData[key];
      // }
      averageRatioArray.push(deliveryRatioData[key].deliveryRatio);
    });
    let average = Math.ceil(
      averageRatioArray.reduce((a, b) => a + b) / averageRatioArray.length,
    );
    // needs to randomize later
    if (average < 10) {
      average = 11;
    }
    const hdong = await this.codeHdongService.findOneByCode(
      proformaConsultResultQueryDto.hdongCode,
    );
    // 질문 관련 값
    const questionScores = await this.__question_c_score_add(
      proformaConsultResultQueryDto.questionGivenArray,
    );

    // get both restaurant and delivery data first
    const sScoreDelivery = await this.sScoreService.findAll(
      proformaConsultResultQueryDto.hdongCode,
      RESTAURANT_TYPE.DELIVERY,
    );
    const sScoreRestaurant = await this.sScoreService.findAll(
      proformaConsultResultQueryDto.hdongCode,
      RESTAURANT_TYPE.RESTAURANT,
    );

    const appliedCScore = await this.__apply_c_score(
      average < 30 ? sScoreRestaurant : sScoreDelivery,
      questionScores,
      cScoreAttributeValue,
      proformaConsultResultQueryDto.fnbOwnerStatus,
    );
    // create proforma first
    let newProforma = new ProformaConsultResultV2(
      proformaConsultResultQueryDto,
    );

    newProforma.cScoreAttributeId = cScoreAttributeValue.id;
    newProforma.hdong = hdong;
    newProforma.hdongCode = proformaConsultResultQueryDto.hdongCode;
    newProforma.totalQuestionInitialCostScore = questionScores.initialCostScore;
    newProforma.totalQuestionManagingScore = questionScores.operationScore;
    newProforma.totalQuestionMenuScore = questionScores.menuscore;
    newProforma.rankDataWCScore = appliedCScore;
    newProforma.deliveryRatioData = {
      deliveryRatio: average,
      restaurantRatio: 100 - average,
    };
    newProforma = await this.proformaConsultRepo.save(newProforma);
    // create event tracker through ip
    this.proformaEventTrackerService.createRecord(newProforma);
    // create new proforma to question tracker
    // 동기
    this.createProformaToQuestionMapper(
      newProforma.id,
      proformaConsultResultQueryDto.ipAddress,
      proformaConsultResultQueryDto.questionGivenArray,
    );
    const response = new ProformaConsultV2ResponseClass();
    response.menuRecommedations = appliedCScore;
    response.deliveryRatio = average;
    return newProforma;
  }

  /**
   * fnb owner status
   * @param proformaConsultResultQueryDto
   * @returns
   */
  async findResponseToQuestionsForFnbOwner(
    proformaConsultResultQueryDto: ProformaConsultResultV2QueryDto,
  ): Promise<ProformaConsultResultV2ResponseClassForCurFnbOwer> {
    const lastQuestion = proformaConsultResultQueryDto.questionGivenArray.slice(
      -1,
    )[0];
    const lastTracker = new QuestionV2Tracker();
    lastTracker.ipAddress = proformaConsultResultQueryDto.ipAddress;
    lastTracker.questionId = lastQuestion.questionId;
    lastTracker.isLastQuestion = YN.YES;
    lastTracker.userType = proformaConsultResultQueryDto.fnbOwnerStatus;
    lastTracker.uniqueSessionId = proformaConsultResultQueryDto.uniqueSessionId;
    lastTracker.givenId = lastQuestion.givenId;
    await this.entityManager.getRepository(QuestionV2Tracker).save(lastTracker);

    //   latest c-score attribute value
    const cScoreAttributeValue = await this.cScoreService.findValid();
    const deliveryRatioData = await this.locationAnalysisService.locationInfoDetail(
      proformaConsultResultQueryDto.hdongCode,
    );
    // 평균 배달 및 홀 비중
    const averageRatioArray: number[] = [];
    Object.keys(deliveryRatioData).forEach(function(key) {
      if (deliveryRatioData[key].deliveryRatio === null) {
        deliveryRatioData[key].deliveryRatio = 0;
      }
      // if (
      //   deliveryRatioData[key] === 'F05' ||
      //   deliveryRatioData[key] === 'F08' ||
      //   deliveryRatioData[key] === 'F09' ||
      //   deliveryRatioData[key] === 'F13' ||
      //   deliveryRatioData[key] === 'F03'
      // ) {
      //   delete deliveryRatioData[key];
      // }
      averageRatioArray.push(deliveryRatioData[key].deliveryRatio);
    });
    let average = Math.ceil(
      averageRatioArray.reduce((a, b) => a + b) / averageRatioArray.length,
    );
    // needs to randomize later
    if (average < 10) {
      average = 11;
    }
    const hdong = await this.codeHdongService.findOneByCode(
      proformaConsultResultQueryDto.hdongCode,
    );

    // 질문 관련 값
    const questionScores = await this.__question_c_score_add(
      proformaConsultResultQueryDto.questionGivenArray,
    );

    // get both restaurant and delivery data first
    // let sScoreDelivery: SScoreDelivery[] | SScoreRestaurant[];
    // if (average < 30) {
    //   sScoreDelivery = await this.sScoreService.findAllWithMediumCategoryCode(
    //     newSscoreDto,
    //     RESTAURANT_TYPE.RESTAURANT,
    //   );
    // } else {
    //   sScoreDelivery = await this.sScoreService.findAllWithMediumCategoryCode(
    //     newSscoreDto,
    //     RESTAURANT_TYPE.DELIVERY,
    //   );
    // }
    // const sScoreDelivery = await this.sScoreService.findAllWithMediumCategoryCode(
    //   newSscoreDto,
    //   RESTAURANT_TYPE.DELIVERY,
    // );
    // TODO: find replacement for data
    // 배달 매출이 없는 관계로 일단 식당형 데이터로 대체
    let newSscoreDto = new SScoreListDto();
    newSscoreDto.hdongCode = proformaConsultResultQueryDto.hdongCode;
    newSscoreDto.mediumCategoryCode =
      proformaConsultResultQueryDto.selectedKbMediumCategory;
    const sScoreRestaurant = await this.sScoreService.findAllWithMediumCategoryCode(
      {
        hdongCode: proformaConsultResultQueryDto.hdongCode,
        mediumCategoryCode:
          proformaConsultResultQueryDto.selectedKbMediumCategory,
      },
      RESTAURANT_TYPE.RESTAURANT,
    );
    const appliedCScore = await this.__apply_c_score(
      sScoreRestaurant,
      questionScores,
      cScoreAttributeValue,
      proformaConsultResultQueryDto.fnbOwnerStatus,
    );
    // create proforma first
    let newProforma = new ProformaConsultResultV2(
      proformaConsultResultQueryDto,
    );

    newProforma.cScoreAttributeId = cScoreAttributeValue.id;
    newProforma.hdong = hdong;
    newProforma.hdongCode = proformaConsultResultQueryDto.hdongCode;
    newProforma.totalQuestionInitialCostScore = questionScores.initialCostScore;
    newProforma.totalQuestionManagingScore = questionScores.operationScore;
    newProforma.totalQuestionMenuScore = questionScores.menuscore;
    newProforma.rankDataWCScore = appliedCScore;
    newProforma.deliveryRatioData = {
      deliveryRatio: average,
      restaurantRatio: 100 - average,
    };
    newProforma = await this.proformaConsultRepo.save(newProforma);
    // create event tracker through ip
    this.proformaEventTrackerService.createRecord(newProforma);
    // create new proforma to question tracker
    // 동기
    this.createProformaToQuestionMapper(
      newProforma.id,
      proformaConsultResultQueryDto.ipAddress,
      proformaConsultResultQueryDto.questionGivenArray,
    );
    // other menu recommendations
    // const otherMenuRecommendations = await this.sScoreService.findSecondarySScore(
    //   newSscoreDto,
    //   average < 20 ? RESTAURANT_TYPE.RESTAURANT : RESTAURANT_TYPE.DELIVERY,
    // );

    const otherMenuRecommendations = await this.sScoreService.findSecondarySScore(
      newSscoreDto,
      RESTAURANT_TYPE.RESTAURANT,
    );
    const response = new ProformaConsultResultV2ResponseClassForCurFnbOwer();
    // throw highest revenue among the s score data
    const sortedDataByEstimatedHighestRevenue = appliedCScore.sort((a, b) =>
      a.estimatedHighestRevenue > b.estimatedHighestRevenue ? -1 : 1,
    );
    response.selectedMenuRecommendation = appliedCScore[0];
    response.deliveryRatio = average;
    response.estimatedRevenue =
      sortedDataByEstimatedHighestRevenue[0].estimatedHighestRevenue;
    // 다른 메뉴 추천
    response.otherMenuRecommendations = await this.__apply_c_score(
      otherMenuRecommendations,
      questionScores,
      cScoreAttributeValue,
      proformaConsultResultQueryDto.fnbOwnerStatus,
      YN.YES,
    );
    response.id = newProforma.id;
    response.hdong = hdong;
    // check question for operation type
    const questionForOperationType = await this.entityManager
      .getRepository(QuestionProformaMapperV2)
      .findOne({ proformaConsultResultId: newProforma.id, questionId: 11 });
    if (questionForOperationType.givenId.includes(38)) {
      response.deliveryOrRestaurantType = DELIVERY_GRADE_TYPE.DELIVERY_ONLY;
    } else if (questionForOperationType.givenId.includes(39)) {
      response.deliveryOrRestaurantType = DELIVERY_GRADE_TYPE.RESTAURANT_ONLY;
    } else if (questionForOperationType.givenId.includes(40)) {
      response.deliveryOrRestaurantType =
        DELIVERY_GRADE_TYPE.RESTAURANT_OR_DELIVERY;
    }
    return response;
  }

  /**
   * create question to proforma mapper
   * @param questions
   * @returns
   */
  async createProformaToQuestionMapper(
    proformaId: number,
    ipAddress: string,
    questions: QuestionGivenArrayClass[],
  ) {
    questions.map(async question => {
      const newTracker = new QuestionProformaMapperV2();
      newTracker.proformaConsultResultId = proformaId;
      newTracker.ipAddress = ipAddress;
      newTracker.givenId = question.givenId;
      newTracker.questionId = question.questionId;
      await this.entityManager
        .getRepository(QuestionProformaMapperV2)
        .save(newTracker);
    });
  }

  //  add all questions depending on question types
  // TODO: figure out a way to automatically loop through enum
  private async __question_c_score_add(
    questions?: QuestionGivenArrayClass[],
  ): Promise<CScoreAggregateClass> {
    const menuScoreArray = [];
    const operatingScoreArray = [];
    const initialCostScoreArray = [];
    const rewashedQuestions: QuestionV2[] = [];
    await Promise.all(
      questions.map(async question => {
        const answeredQuestion = await this.entityManager
          .getRepository(QuestionV2)
          .findOne(question.questionId);
        const givens = await this.entityManager
          .getRepository(QuestionGivenV2)
          .createQueryBuilder('givens')
          .AndWhereIn('givens', 'id', question.givenId)
          .getMany();
        answeredQuestion.givens = givens;
        rewashedQuestions.push(answeredQuestion);
      }),
    );
    await Promise.all(
      rewashedQuestions.map(question => {
        if (question.questionType === QUESTION_TYPE.MENU_SCORE_TYPE) {
          question.givens.map(given => {
            menuScoreArray.push(given.value);
          });
        } else if (
          question.questionType === QUESTION_TYPE.OPERATION_SCORE_TYPE
        ) {
          question.givens.map(given => {
            operatingScoreArray.push(given.value);
          });
        } else if (
          question.questionType === QUESTION_TYPE.OPERATION_COST_SCORE_TYPE
        ) {
          question.givens.map(given => {
            initialCostScoreArray.push(given.value);
          });
        }
      }),
    );
    const newClass = new CScoreAggregateClass();
    newClass.menuscore = menuScoreArray.reduce((a, b) => a + b, 0);
    newClass.operationScore = operatingScoreArray.reduce((a, b) => a + b, 0);
    newClass.initialCostScore = initialCostScoreArray.reduce(
      (a, b) => a + b,
      0,
    );

    // return added up points of answered questions
    return newClass;
  }

  // TODO:  Math.abs 사용...이것도 기능으로???
  private async __apply_c_score(
    sScoreData: SScoreDelivery[] | SScoreRestaurant[],
    questionScore: CScoreAggregateClass,
    cScoreAttributeValid: CScoreAttribute,
    userType: FNB_OWNER,
    isOtherMenu?: YN,
  ): Promise<SScoreDelivery[] | SScoreRestaurant[]> {
    if (sScoreData && sScoreData.length < 1) {
      throw new BrandAiException('proforma.notEnoughData');
    }
    await Promise.all(
      sScoreData.map(async data => {
        const menuPercentageGrade = Math.ceil(
          (questionScore.menuscore /
            (userType === FNB_OWNER.CUR_FNB_OWNER
              ? cScoreAttributeValid.curHighestMenuScore
              : cScoreAttributeValid.newHighestMenuScore)) *
            100,
        );
        const operatingPercentageGrade =
          (questionScore.operationScore /
            Math.ceil(
              userType === FNB_OWNER.CUR_FNB_OWNER
                ? cScoreAttributeValid.curHighestManagingScore
                : cScoreAttributeValid.newHighestManagingScore,
            )) *
          100;
        const initialCostPercentageGrade = Math.ceil(
          (questionScore.initialCostScore /
            (userType === FNB_OWNER.CUR_FNB_OWNER
              ? cScoreAttributeValid.curHighestInitialCostScore
              : cScoreAttributeValid.newHighestInitialCostScore)) *
            100,
        );
        const finalScore =
          data.averageScore -
          cScoreAttributeValid.multiplier *
            (Math.abs(data.attributeValues.cookingScore - menuPercentageGrade) +
              Math.abs(
                data.attributeValues.managingScore - operatingPercentageGrade,
              ) +
              Math.abs(
                data.attributeValues.initialCostScore -
                  initialCostPercentageGrade,
              ));

        data.appliedCScoreRanking = finalScore;
        data.appliedReductionScore = data.averageScore - finalScore;

        //  조리 경험 점수
        data.cookingExperienceScore = Math.floor(
          100 -
            Math.abs(
              data.attributeValues.cookingScore - questionScore.menuscore,
            ),
        );
        data.operationExperienceScore = Math.floor(
          100 -
            Math.abs(
              data.attributeValues.managingScore - questionScore.operationScore,
            ),
        );
        data.initialCostScore = Math.floor(
          100 -
            Math.abs(
              data.attributeValues.initialCostScore -
                questionScore.initialCostScore,
            ),
        );
        // 예상 매출
        if (userType === FNB_OWNER.CUR_FNB_OWNER) {
          data.estimatedHighestRevenue = await this.__get_revenue_data(data);
        }
        // 매출 상승세
        if (userType === FNB_OWNER.NEW_FNB_OWNER) {
          data.estimatedIncreasedRevenuePercentage = await this.__trajectory_data(
            data,
          );
        }
      }),
    );
    // sort by applied ranking
    sScoreData = sScoreData.sort((a, b) =>
      a.appliedCScoreRanking > b.appliedCScoreRanking ? -1 : 1,
    );
    sScoreData.map(score => {
      score.appliedNewRanking = sScoreData.indexOf(score) + 1;
      score.mediumCategoryName = KB_FOOD_CATEGORY[score.mediumCategoryCode];
      if (sScoreData.indexOf(score) === 0) {
        score.appliedFitnessScore =
          isOtherMenu === YN.YES
            ? 93 - 100 / score.appliedCScoreRanking
            : 96 - 100 / score.appliedCScoreRanking;
        // 빅데이터 상권 점수
        score.bigDataLocationScore = Math.floor(
          isOtherMenu === YN.YES
            ? 91 - 100 / score.averageScore
            : 97 - 100 / score.averageScore,
        );
      } else if (sScoreData.indexOf(score) === 1) {
        score.appliedFitnessScore =
          isOtherMenu === YN.YES
            ? 80 - 100 / score.appliedCScoreRanking
            : 82 - 100 / score.appliedCScoreRanking;
        score.bigDataLocationScore = Math.floor(
          isOtherMenu === YN.YES
            ? 83 - 100 / score.averageScore
            : 86 - 100 / score.averageScore,
        );
      } else if (sScoreData.indexOf(score) === 2) {
        score.appliedFitnessScore =
          isOtherMenu === YN.YES
            ? 70 - 100 / score.appliedCScoreRanking
            : 72 - 100 / score.appliedCScoreRanking;
        score.bigDataLocationScore = Math.floor(
          isOtherMenu === YN.YES
            ? 69 - 100 / score.averageScore
            : 71 - 100 / score.averageScore,
        );
      }
    });
    return sScoreData;
  }

  /**
   * 매출 추이 또는 예상 매출
   * @param sScoreData
   */
  private async __get_revenue_data(
    sScoreData: SScoreDelivery | SScoreRestaurant,
  ) {
    let revenue;
    const data = await Axios.get(
      `${this.analysisUrl}location-small-category-revenue-by-quarter`,
      {
        params: {
          hdongCode: sScoreData.hdongCode,
          sSmallCategoryCode: sScoreData.sSmallCategoryCode,
        },
      },
    );
    if (sScoreData instanceof SScoreDelivery) {
      const checkRevenueTracker = await this.entityManager
        .getRepository(ModifiedRevenueTracker)
        .findOne({
          where: {
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            restaurantType: RESTAURANT_TYPE.DELIVERY,
          },
        });
      if (!checkRevenueTracker) {
        if (
          data.data.value[0].deliveryRevenue < 1000000 ||
          !data.data.value[0].deliveryRevenue ||
          data.data.value.length < 1
        ) {
          const newRevenue = parseInt(`${RandomRevenueGenerator()}0000`);

          const newRevenueTracker = new ModifiedRevenueTracker({
            restaurantType: RESTAURANT_TYPE.DELIVERY,
            revenue: newRevenue,
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
          });
          this.entityManager
            .getRepository(ModifiedRevenueTracker)
            .save(newRevenueTracker);
          revenue = newRevenue;
        } else {
          revenue = data.data.value[0].deliveryRevenue;
        }
      } else {
        revenue = checkRevenueTracker.revenue;
      }
    }
    if (sScoreData instanceof SScoreRestaurant) {
      const checkRevenueTracker = await this.entityManager
        .getRepository(ModifiedRevenueTracker)
        .findOne({
          where: {
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            restaurantType: RESTAURANT_TYPE.RESTAURANT,
          },
        });
      if (!checkRevenueTracker) {
        if (
          data.data.value[0].restaurantRevenue < 1000000 ||
          !data.data.value[0].restaurantRevenue ||
          data.data.value.length < 1
        ) {
          let newRevenue = parseInt(`${RandomRevenueGenerator()}0000`);

          const newRevenueTracker = new ModifiedRevenueTracker({
            restaurantType: RESTAURANT_TYPE.RESTAURANT,
            revenue: newRevenue,
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
          });
          this.entityManager
            .getRepository(ModifiedRevenueTracker)
            .save(newRevenueTracker);
          revenue = newRevenue;
        } else {
          revenue = data.data.value[0].restaurantRevenue;
        }
      } else {
        revenue = checkRevenueTracker.revenue;
      }
    }
    //  control large numbers
    if (revenue > 3300000) {
      revenue = Math.trunc(revenue / 2.8);
    }
    return revenue;
  }

  private async __trajectory_data(
    sScoreData: SScoreDelivery | SScoreRestaurant,
  ) {
    let percentage;
    if (sScoreData instanceof SScoreDelivery) {
      const checkTracker = await this.entityManager
        .getRepository(ModifiedTrajectoryTracker)
        .findOne({
          where: {
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            restaurantType: RESTAURANT_TYPE.DELIVERY,
          },
        });
      if (!checkTracker) {
        const revenue = await Axios.get(
          `${this.analysisUrl}location-small-category-revenue-by-quarter`,
          {
            params: {
              hdongCode: sScoreData.hdongCode,
              sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            },
          },
        );
        const lastQuarterRevenue = await Axios.get(
          `${this.analysisUrl}location-small-category-revenue-by-last-quarter`,
          {
            params: {
              hdongCode: sScoreData.hdongCode,
              sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            },
          },
        );
        if (
          revenue.data.value.length < 1 ||
          lastQuarterRevenue.data.value.length < 1
        ) {
          const newPercentage = RandomTrajectoryGenerator();
          percentage = new ModifiedTrajectoryTracker({
            percentage: newPercentage,
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            restaurantType: RESTAURANT_TYPE.DELIVERY,
          });
          percentage = this.entityManager.save(percentage);
          percentage = newPercentage;
          return percentage;
        } else {
          percentage =
            (revenue.data.value[0].deliveryRevenue -
              lastQuarterRevenue.data.value[0].lastQuarterDeliveryRevenue) /
            lastQuarterRevenue.data.value[0].lastQuarterDeliveryRevenue;
          if (percentage < 10 || !percentage) {
            const newPercentage = RandomTrajectoryGenerator();
            percentage = new ModifiedTrajectoryTracker({
              percentage: newPercentage,
              hdongCode: sScoreData.hdongCode,
              sSmallCategoryCode: sScoreData.sSmallCategoryCode,
              restaurantType: RESTAURANT_TYPE.DELIVERY,
            });
            percentage = this.entityManager.save(percentage);
            percentage = newPercentage;
            return percentage;
          }
        }
      } else {
        percentage = checkTracker.percentage;
      }
    }
    if (sScoreData instanceof SScoreRestaurant) {
      const checkTracker = await this.entityManager
        .getRepository(ModifiedTrajectoryTracker)
        .findOne({
          where: {
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            restaurantType: RESTAURANT_TYPE.RESTAURANT,
          },
        });
      if (!checkTracker) {
        const revenue = await Axios.get(
          `${this.analysisUrl}location-small-category-revenue-by-quarter`,
          {
            params: {
              hdongCode: sScoreData.hdongCode,
              sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            },
          },
        );
        const lastQuarterRevenue = await Axios.get(
          `${this.analysisUrl}location-small-category-revenue-by-last-quarter`,
          {
            params: {
              hdongCode: sScoreData.hdongCode,
              sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            },
          },
        );
        if (
          revenue.data.value.length < 1 ||
          lastQuarterRevenue.data.value.length < 1
        ) {
          const newPercentage = RandomTrajectoryGenerator();
          percentage = new ModifiedTrajectoryTracker({
            percentage: newPercentage,
            hdongCode: sScoreData.hdongCode,
            sSmallCategoryCode: sScoreData.sSmallCategoryCode,
            restaurantType: RESTAURANT_TYPE.RESTAURANT,
          });
          percentage = this.entityManager.save(percentage);
          percentage = newPercentage;
          return percentage;
        } else {
          percentage =
            (revenue.data.value[0].restaurantRevenue -
              lastQuarterRevenue.data.value[0].lastQuarterRestaurantRevenue) /
            lastQuarterRevenue.data.value[0].lastQuarterRestaurantRevenue;
          if (percentage < 10 || !percentage) {
            const newPercentage = RandomTrajectoryGenerator();
            percentage = new ModifiedTrajectoryTracker({
              percentage: newPercentage,
              hdongCode: sScoreData.hdongCode,
              sSmallCategoryCode: sScoreData.sSmallCategoryCode,
              restaurantType: RESTAURANT_TYPE.RESTAURANT,
            });
            percentage = this.entityManager.save(percentage);
            percentage = newPercentage;
            return percentage;
          }
        }
      } else {
        percentage = checkTracker.percentage;
      }
    }

    return percentage;
  }
}
