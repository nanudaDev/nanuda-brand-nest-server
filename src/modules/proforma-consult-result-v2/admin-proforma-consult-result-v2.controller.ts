import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CONST_ADMIN_USER } from 'src/shared';
import { PlatformAuthRolesGuard } from '../../core/guards/platform-auth-roles.guard';
import { BaseController } from '../../core/base.controller';
import { ProformaConsultResultV2Service } from './proforma-consult-result-v2.service';
import { AdminProformaConsultResultV2ListDto } from './dto/admin-proforma-consult-result-v2-list.dto';
import {
  PaginatedResponse,
  PaginatedRequest,
} from '../../common/interfaces/pagination.type';
import { ProformaConsultResultV2 } from './proforma-consult-result-v2.entity';

@Controller('v2')
@ApiTags('ADMIN PROFORMA CONSULT RESULT V2')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminProformaConsultResultV2Controller extends BaseController {
  constructor(
    private readonly proformaConsultResultV2Service: ProformaConsultResultV2Service,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminProformaConsultResultV2ListDto
   * @param pagination
   * @returns
   */
  @Get('/admin/proforma-consult-result')
  async findAll(
    @Query()
    adminProformaConsultResultV2ListDto: AdminProformaConsultResultV2ListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProformaConsultResultV2>> {
    return await this.proformaConsultResultV2Service.findAllForAdmin(
      adminProformaConsultResultV2ListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  @Get('/admin/proforma-consult-result/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProformaConsultResultV2> {
    return await this.proformaConsultResultV2Service.findOneForAdmin(id);
  }
}
