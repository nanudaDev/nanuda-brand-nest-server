import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AggregateResultResponseService } from './aggregate-result-resource.service';
import {
  AggregateResultResponseQueryDto,
  AggregateResultResponseTimeGraphDto,
} from './dto';

@Controller()
@ApiTags('AGGREGATE RESULT RESPONSE')
export class AggregateResultResponseController extends BaseController {
  constructor(
    private readonly aggregateResultResponseService: AggregateResultResponseService,
  ) {
    super();
  }

  /**
   * find question and register
   * @param aggregateQuestionQuery
   */
  @Post('/aggregate-result-response')
  async findAggregateResponse(
    @Body() aggregateQuestionQuery: AggregateResultResponseQueryDto,
  ) {
    return await this.aggregateResultResponseService.findResponseForQuestions(
      aggregateQuestionQuery,
    );
  }

  /**
   * time graph
   * @param dto
   */
  @Get('/aggregate-result-response/time-graph')
  async getGraphTest(@Query() dto: AggregateResultResponseTimeGraphDto) {
    return await this.aggregateResultResponseService.getTimeGraphForKbCategory(
      dto,
    );
  }

  /**
   * time graph
   * @param dto
   */
  @Get('/aggregate-result-response/gender-graph')
  async genderGraph(@Query() dto: AggregateResultResponseTimeGraphDto) {
    return await this.aggregateResultResponseService.genderGraph(dto);
  }

  @Post('/test/sentence-constructor')
  async sentenceConstructor() {
    const response = [
      {
        operationTime: 'BREAKFAST',
        modifiedResponse: {
          id: 1,
          created: '2021-03-10T08:49:03.000Z',
          updated: '2021-03-15T08:58:47.000Z',
          deliveryRatioGrade: 1,
          deliveryRatioCode: 'DELIVERY_SPACE_BEST',
          responseCode: null,
          ageGroupGrade: 1,
          ageGroupCode: '2030',
          revenueRangeCode: '3000_OVER',
          revenueRangeGrade: 1,
          isReadyCode: null,
          isReadyGrade: null,
          response:
            '한식의 국/탕류와 같은 배달 전문 메뉴 위주로 추가해야 매출 상승 확률이 가장 높습니다.',
          fnbOwnerStatus: 'CUR_FNB_OWNER',
        },
        koreanPrefSentence: '아침',
        modifiedSufSentence: '한식의 백반류',
      },
      {
        operationTime: 'LUNCH',
        modifiedResponse: {
          id: 1,
          created: '2021-03-10T08:49:03.000Z',
          updated: '2021-03-15T08:58:47.000Z',
          deliveryRatioGrade: 1,
          deliveryRatioCode: 'DELIVERY_SPACE_BEST',
          responseCode: null,
          ageGroupGrade: 1,
          ageGroupCode: '2030',
          revenueRangeCode: '3000_OVER',
          revenueRangeGrade: 1,
          isReadyCode: null,
          isReadyGrade: null,
          response:
            '한식의 국/탕류와 같은 배달 전문 메뉴 위주로 추가해야 매출 상승 확률이 가장 높습니다.',
          fnbOwnerStatus: 'CUR_FNB_OWNER',
        },
        koreanPrefSentence: '점심',
        modifiedSufSentence: '한식의 백반류',
      },
      {
        operationTime: 'DINNER',
        modifiedResponse: {
          id: 1,
          created: '2021-03-10T08:49:03.000Z',
          updated: '2021-03-15T08:58:47.000Z',
          deliveryRatioGrade: 1,
          deliveryRatioCode: 'DELIVERY_SPACE_BEST',
          responseCode: null,
          ageGroupGrade: 1,
          ageGroupCode: '2030',
          revenueRangeCode: '3000_OVER',
          revenueRangeGrade: 1,
          isReadyCode: null,
          isReadyGrade: null,
          response:
            '한식의 국/탕류와 같은 배달 전문 메뉴 위주로 추가해야 매출 상승 확률이 가장 높습니다.',
          fnbOwnerStatus: 'CUR_FNB_OWNER',
        },
        koreanPrefSentence: '저녁',
        modifiedSufSentence: '한식의 국탕류',
      },
    ];

    return await this.aggregateResultResponseService.sentenceTest(response);
  }
}
