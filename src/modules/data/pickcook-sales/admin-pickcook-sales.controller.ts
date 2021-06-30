import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BaseController } from '../../../core/base.controller';
import { PickcookSalesService } from './pickcook-sales.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { AdminPickcookSalesQueryDto } from './dto/admin-pickcook-sales-query.dto';
import { PickcookSales } from '../entities/pickcook-sales.entity';

@Controller('v3')
@ApiTags('ADMIN PICKCOOK SALES')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminPickcookSalesController extends BaseController {
  constructor(private readonly pickcookSalesService: PickcookSalesService) {
    super();
  }

  /**
   * find pickcook data
   * @param adminPickcookSalesQueryDto
   * @returns
   */
  @Get('/admin/pickcook-sales')
  async findPickcookSalesQuery(
    @Query() adminPickcookSalesQueryDto: AdminPickcookSalesQueryDto,
  ): Promise<PickcookSales> {
    return await this.pickcookSalesService.findPickcookSales(
      adminPickcookSalesQueryDto,
    );
  }
}
