import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseController } from '../../core/base.controller';
import { AdminProformaEventTrackerListDto } from './dto';
import { ProformaEventTracker } from './proforma-event-tracker.entity';
import { ProformaEventTrackerService } from './proforma-event-tracker.service';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../common/interfaces/pagination.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlatformAuthRolesGuard } from '../../core/guards/platform-auth-roles.guard';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { CONST_ADMIN_USER } from '../../shared/platform-common-code.type';
import { AdminProformaEventTrackerCountDto } from './dto/admin-proforma-event-tracker-count.dto';

@Controller('v2')
@ApiTags('ADMIN PROFORMA EVENT TRACKER')
// @ApiBearerAuth()
// @UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminProformEventTrackerController extends BaseController {
  constructor(
    private readonly proformaEventTrackerService: ProformaEventTrackerService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminProformaEventTrackerListDto
   * @param pagination
   * @returns pagination proforma event tracker
   */
  @Get('/admin/proforma-event-tracker')
  async findAllForAdmin(
    @Query() adminProformaEventTrackerListDto: AdminProformaEventTrackerListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProformaEventTracker>> {
    return await this.proformaEventTrackerService.findAllForAdmin(
      adminProformaEventTrackerListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   * @returns proforma event tracker
   */
  @Get('/admin/proforma-event-tracker/:id([0-9]+)')
  async findOneForAdmin(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProformaEventTracker> {
    return await this.proformaEventTrackerService.findOneForAdmin(id);
  }

  /**
   * get counts
   * @param adminProformaEventTrackerCountDto
   * @returns number
   */
  @Get('/admin/proforma-event-tracker/get-count')
  async findCount(
    @Query()
    adminProformaEventTrackerCountDto: AdminProformaEventTrackerCountDto,
  ) {
    return await this.proformaEventTrackerService.findCounts(
      adminProformaEventTrackerCountDto,
    );
  }
}
