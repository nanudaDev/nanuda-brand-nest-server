import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { ConsultResultV2 } from './consult-result-v2.entity';
import { ConsultResultV2Service } from './consult-result-v2.service';
import { ConsultResultV2CreateDto } from './dto';
import { Request } from 'express';

@Controller('v2')
@ApiTags('CONSULT RESULT V2')
export class ConsultResultV2Controller extends BaseController {
  constructor(private readonly consultService: ConsultResultV2Service) {
    super();
  }

  /**
   * create consult for user
   * @param consultResultCreateDto
   */
  @Post('/consult-result')
  async createForUser(
    @Body() consultResultV2CreateDto: ConsultResultV2CreateDto,
    @Req() req: Request,
  ): Promise<ConsultResultV2> {
    return await this.consultService.createForUser(
      consultResultV2CreateDto,
      req,
    );
  }
}
