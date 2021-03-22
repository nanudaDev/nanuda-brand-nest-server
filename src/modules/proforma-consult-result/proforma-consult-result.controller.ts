import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { ProformaConsultResult } from './proforma-consult-result.entity';
import { ProformaConsultResultService } from './proforma-consult-result.service';

@Controller()
@ApiTags('PROFORMA CONSULT RESULT')
export class ProformaConsultResultController extends BaseController {
  constructor(private readonly proformaService: ProformaConsultResultService) {
    super();
  }

  /**
   * find one
   * @param id
   */
  @Get('/proforma-consult-result/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProformaConsultResult> {
    return await this.proformaService.findOne(id);
  }
}
