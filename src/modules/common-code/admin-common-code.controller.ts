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
import { CommonCode } from './common-code.entity';
import { CommonCodeService } from './common-code.service';
import { AdminCommonCodeListDto } from './dto';

@Controller()
@ApiTags('ADMIN COMMON CODE')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_ROLES))
export class AdminCommonCodeController extends BaseController {
  constructor(private readonly commonCodeService: CommonCodeService) {
    super();
  }

  /**
   * find all
   * @param adminCommonCodeListDto
   * @param pagination
   */
  @Get('/admin/common-code')
  async findAll(
    @Query() adminCommonCodeListDto: AdminCommonCodeListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CommonCode>> {
    return await this.commonCodeService.findAllForAdmin(
      adminCommonCodeListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param id
   */
  @Get('/admin/common-code/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CommonCode> {
    return await this.commonCodeService.findOneForAdmin(id);
  }
}
