import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AggregateResultResponseService } from './aggregate-result-resource.service';

@Controller()
@ApiTags('AGGREGATE RESULT RESPONSE')
export class AggregateResultResponseController extends BaseController {
  constructor(
    private readonly aggregateResultResponseService: AggregateResultResponseService,
  ) {
    super();
  }

  /**
   * transfer data from backup table to production table
   */
  @Get('/aggregate-response/transger')
  async transferData() {
    return await this.aggregateResultResponseService.transferData();
  }
}
