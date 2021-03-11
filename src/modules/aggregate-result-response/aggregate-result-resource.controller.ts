import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AggregateResultResponseService } from './aggregate-result-resource.service';
import { AggregateResultResponseQueryDto } from './dto';

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
   * transfer data from backup table to production table
   */
  @Get('/aggregate-response/transger')
  async transferData() {
    return await this.aggregateResultResponseService.transferData();
  }
}
