import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../core/base.controller';
import { ProformaConsultResultV3Service } from './proforma-consult-result-v3.service';
import { ProformaConsultResultV3CreateDto } from './dto/proforma-consult-result-v3-create.dto';
import { ProformaConsultResultV3 } from './proforma-consult-result-v3.entity';

@Controller('v3')
@ApiTags('PROFORMA CONSULT RESULT V3')
export class ProformaConsultResultV3Controller extends BaseController {
  constructor(
    private readonly proformaService: ProformaConsultResultV3Service,
  ) {
    super();
  }

  /**
   * create proforma for landing page
   * @param proformaConsultCreateDto
   * @returns
   */
  @Post('/proforma-consult-response')
  async create(
    @Body() proformaConsultCreateDto: ProformaConsultResultV3CreateDto,
  ): Promise<ProformaConsultResultV3> {
    return await this.proformaService.createProforma(proformaConsultCreateDto);
  }
}
