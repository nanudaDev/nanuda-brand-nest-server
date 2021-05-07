import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { BaseController, BaseDto, PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { ConsultResultV2 } from './consult-result-v2.entity';
import { ConsultResultV2Service } from './consult-result-v2.service';
import {
  AdminConsultResultV2ListDto,
  AdminConsultResultV2UpdateDto,
} from './dto';

@Controller('v2')
@ApiTags('ADMIN CONSULT RESULT V2')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminConsultResultV2Controller extends BaseController {
  constructor(private readonly consultResultService: ConsultResultV2Service) {
    super();
  }

  /**
   * find all for admi
   * @param adminConsultResultListDto
   * @param pagination
   */
  @Get('/admin/consult-response')
  async findAll(
    @Query() adminConsultResultListDto: AdminConsultResultV2ListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResultV2>> {
    return await this.consultResultService.findAllForAdmin(
      adminConsultResultListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   */
  @Get('/admin/consult-response/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ConsultResultV2> {
    return await this.consultResultService.findOneForAdmin(id);
  }

  /**
   * update for admin
   * @param id
   * @param adminConsultResponseUpdateDto
   */
  @Patch('/admin/consult-response/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminConsultResponseUpdateDto: AdminConsultResultV2UpdateDto,
  ): Promise<ConsultResultV2> {
    return await this.consultResultService.updateForAdmin(
      id,
      adminConsultResponseUpdateDto,
    );
  }

  /**
   * assign myself
   * @param admin
   * @param consultId
   */
  @Patch('/admin/consult-response/:id([0-9]+)/assign-myself')
  async assignMyself(
    @UserInfo() admin: PlatformAdmin,
    @Param('id', ParseIntPipe) consultId: number,
  ): Promise<ConsultResultV2> {
    return await this.consultResultService.assignAdmin(admin.no, consultId);
  }
}
