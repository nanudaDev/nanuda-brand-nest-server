import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from '../../core/base.controller';
import { ConsultResultV3 } from './consult-result-v3.entity';
import { ConsultResultV3Service } from './consult-result-v3.service';
import { ConsultResultV3CreateDto } from './dto';

@Controller('v3')
@ApiTags('CONSULT RESULT V3')
export class ConsultResultV3Controller extends BaseController {
  constructor(private readonly consultService: ConsultResultV3Service) {
    super();
  }

  /**
   * create for landing page
   * @param consultCreateDto
   * @param req
   * @returns
   */
  @ApiOperation({ description: '상담 신청하기' })
  @Post('/consult-result')
  async createConsult(
    @Body() consultCreateDto: ConsultResultV3CreateDto,
    @Req() req: Request,
  ): Promise<ConsultResultV3> {
    return await this.consultService.createConsult(consultCreateDto, req);
  }

  @ApiOperation({ description: '랜딩 페이지에 상담 완료 카운트 수' })
  @Get('/consult-result/get-count')
  async getCount(): Promise<number> {
    return await this.consultService.getConsultCount();
  }
}
