import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { ProformaConsultResultV2Service } from './proforma-consult-result-v2.service';

@Controller('v2')
@ApiTags('PROFORMA CONSULT RESULT V2')
export class ProformaConsultResultV2Controller extends BaseController {
  constructor(
    private readonly proformaConsultV2Service: ProformaConsultResultV2Service,
  ) {
    super();
  }
}
