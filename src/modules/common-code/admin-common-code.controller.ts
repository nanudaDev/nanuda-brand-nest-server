import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import {
  AuthRolesGuard,
  BaseController,
  PlatformAuthRolesGuard,
} from 'src/core';
import { CONST_ADMIN_ROLES, CONST_ADMIN_USER } from 'src/shared';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CommonCode } from './common-code.entity';
import { CommonCodeService } from './common-code.service';
import { AdminCommonCodeListDto } from './dto';

@Controller()
@ApiTags('ADMIN COMMON CODE')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCommonCodeController extends BaseController {
  constructor(private readonly commonCodeService: CommonCodeService) {
    super();
  }

  /**
   * find all
   * @param adminCommonCodeListDto
   * @param pagination
   */
  @ApiOperation({ description: '관리자 공통 코드 리스트' })
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
  @ApiOperation({ description: '관리자 공통 코드 찾기' })
  @Get('/admin/common-code/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CommonCode> {
    return await this.commonCodeService.findOneForAdmin(id);
  }
}
