import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { ConsultResult } from './consult-result.entity';
import { ConsultResultService } from './consult-result.service';
import { AdminConsultResultListDto } from './dto';

@Controller()
@ApiTags('ADMIN CONSULT RESPONSE')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_ROLES))
export class AdminConsultResponseController extends BaseController {
  constructor(private readonly consultResultService: ConsultResultService) {
    super();
  }

  /**
   * find all for admi
   * @param adminConsultResultListDto
   * @param pagination
   */
  @Get('/admin/consult-response')
  async findAll(
    @Query() adminConsultResultListDto: AdminConsultResultListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResult>> {
    return await this.consultResultService.findAllForAdmin(
      adminConsultResultListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   */
  @Get('/admin/consult-repsonse/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ConsultResult> {
    return await this.consultResultService.findOneForAdmin(id);
  }
}
