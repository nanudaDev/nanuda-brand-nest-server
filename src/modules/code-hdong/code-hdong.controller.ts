import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongService } from './code-hdong.service';

@Controller()
@ApiTags('CODE HDONG')
export class CodeHdongController extends BaseController {
  constructor(private readonly codeHdongService: CodeHdongService) {
    super();
  }

  /**
   * find all sido
   */
  @Get('/code-hdong/sido')
  async findAllSido(): Promise<CodeHdong[]> {
    return await this.codeHdongService.findAllSido();
  }
}
