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
}
