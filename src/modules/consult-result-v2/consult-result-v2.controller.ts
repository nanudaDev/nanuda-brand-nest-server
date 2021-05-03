import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';

@Controller()
@ApiTags('CONSULT RESULT V2')
export class ConsultResultV2Controller extends BaseController {
  constructor() {
    super();
  }
}
