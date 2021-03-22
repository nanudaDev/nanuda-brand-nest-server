import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { AdminResultResponseCreateDto } from './dto';
import { ResultResponse } from './result-response.entity';
import { ResultResponseService } from './result-response.service';

@Controller()
@ApiTags('ADMIN RESULT RESPONSE')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_ROLES))
export class AdminResultResponseController extends BaseController {
  constructor(private readonly resultResponseService: ResultResponseService) {
    super();
  }

  /**
   * create for admin
   * @param adminResultResponseCreateDto
   */
  @Post('/admin/result-response')
  async create(
    @Body() adminResultResponseCreateDto: AdminResultResponseCreateDto,
  ): Promise<ResultResponse> {
    return await this.resultResponseService.createForAdmin(
      adminResultResponseCreateDto,
    );
  }

  /**
   * test transfer
   */
  @Get('/admin/backup-transfer')
  async transferData() {
    return await this.resultResponseService.transferToProductionFile();
  }
}
