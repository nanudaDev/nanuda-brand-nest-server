import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { ResultResponseService } from './result-response.service';

@Controller()
@ApiTags('RESULT RESPONSE')
export class ResultResponseController extends BaseController {
  constructor(private readonly resultResponseService: ResultResponseService) {
    super();
  }
}
