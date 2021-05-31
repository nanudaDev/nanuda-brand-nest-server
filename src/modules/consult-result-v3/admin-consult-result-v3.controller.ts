import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { BaseController } from '../../core/base.controller';
import { AdminConsultResultV3ListDto } from './dto/admin-consult-result-v3-list.dto';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../common/interfaces/pagination.type';
import { ConsultResultV3 } from './consult-result-v3.entity';
import { ConsultResultV3Service } from './consult-result-v3.service';
import { Patch } from '@nestjs/common';
import { UserInfo } from 'src/common';
import { PlatformAdmin } from '../admin/platform-admin.entity';

@Controller('v3')
@ApiTags('ADMIN CONSULT RESULT V3')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminConsultResultV3Controller extends BaseController {
  constructor(private readonly consultService: ConsultResultV3Service) {
    super();
  }

  /**
   * find all for admin
   * @param adminConsultResultV3ListDto
   * @param pagination
   * @returns
   */
  @ApiOperation({ description: '관리자 상담 신청서 검색/리스트' })
  @Get('/admin/consult-result-v3')
  async findAll(
    @Query() adminConsultResultV3ListDto: AdminConsultResultV3ListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResultV3>> {
    return await this.consultService.findAllForAdmin(
      adminConsultResultV3ListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  @ApiOperation({ description: '관리자 상담 신청서 찾기' })
  @Get('/admin/consult-result-v3/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConsultResultV3> {
    return await this.consultService.findOneForAdmin(id);
  }

  /**
   * 본인으로 정하기
   * @param admin
   * @param id
   * @returns
   */
  @ApiOperation({ description: '관리자 담당자 본인으로 ' })
  @Patch('/admin/consult-response/:id([0-9]+)/assign-myself')
  async assignMyself(
    @UserInfo() admin: PlatformAdmin,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConsultResultV3> {
    return await this.consultService.assignMyself(id, admin.no);
  }
}
