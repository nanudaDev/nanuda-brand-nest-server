import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { ProformaConsultResultV2QueryDto } from './dto';
import { ProformaConsultResultV2Service } from './proforma-consult-result-v2.service';

@Controller('v2')
@ApiTags('PROFORMA CONSULT RESULT V2')
export class ProformaConsultResultV2Controller extends BaseController {
  constructor(
    private readonly proformaConsultV2Service: ProformaConsultResultV2Service,
  ) {
    super();
  }

  /**
   * find question and register
   * @param aggregateQuestionQuery
   */
  @Post('/proforma-consult-response')
  async findAggregateResponse(
    @Body() proformaConsultQueryDto: ProformaConsultResultV2QueryDto,
  ) {
    return await this.proformaConsultV2Service.findResponseToQuestion(
      proformaConsultQueryDto,
    );
  }

  @Post('/proforma-consult-response-w-other')
  async findAggregateResponseForCurFnbOwner(
    @Body() proformaConsultQueryDto: ProformaConsultResultV2QueryDto,
  ) {
    if (proformaConsultQueryDto.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER) {
      return await this.proformaConsultV2Service.findResponseToQuestion(
        proformaConsultQueryDto,
      );
    } else {
      return await this.proformaConsultV2Service.findResponseToQuestionsForFnbOwner(
        proformaConsultQueryDto,
      );
    }
  }
}
