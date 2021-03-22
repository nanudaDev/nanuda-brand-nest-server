import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CommonCode } from './common-code.entity';
import { CommonCodeService } from './common-code.service';
import { CommonCodeListDto } from './dto';

@Controller()
@ApiTags('COMMON CODE')
export class CommonCodeController extends BaseController {
  constructor(private readonly commonCodeService: CommonCodeService) {
    super();
  }

  /**
   * find all for user
   * @param commonCodeListDto
   */
  @Get('/common-code')
  async findAll(
    @Query() commonCodeListDto: CommonCodeListDto,
  ): Promise<CommonCode[]> {
    return await this.commonCodeService.findForAllUsers(commonCodeListDto);
  }
}
