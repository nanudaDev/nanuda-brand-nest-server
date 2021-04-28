import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';

@Controller()
@ApiTags('QUESTION V2')
export class QuestionV2Controller extends BaseController {
  constructor() {
    super();
  }
}
