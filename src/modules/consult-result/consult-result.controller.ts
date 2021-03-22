import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import { CustomPromisifySymbol } from 'util';
import { ConsultResult } from './consult-result.entity';
import { ConsultResultService } from './consult-result.service';
import { ConsultResultResponseCreateDto } from './dto';

@Controller()
@ApiTags('CONSULT RESPONSE')
export class ConsultResultController extends BaseController {
  constructor(private readonly consultResultService: ConsultResultService) {
    super();
  }

  /**
   * create consult for user
   * @param consultResultCreateDto
   */
  @Post('/consult-result')
  async createForUser(
    @Body() consultResultCreateDto: ConsultResultResponseCreateDto,
    @Req() req: Request,
  ): Promise<ConsultResult> {
    return await this.consultResultService.createForUser(
      consultResultCreateDto,
      req,
    );
  }
}
