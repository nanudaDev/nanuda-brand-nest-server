import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { KbFoodCategoryGroup } from '../entities';
import { AdminKbFoodCategoryGroupListDto } from './dto';
import { MenuAnalysisService } from './menu-analysis.service';

@Controller()
@ApiTags('KB CATEGORY')
export class KbCategoryController extends BaseController {
  constructor(private readonly menuAnalysisService: MenuAnalysisService) {
    super();
  }

  /**
   * find all for admin
   * @param adminKbCategoryListDto
   * @param pagination
   */
  @Get('/kb-category')
  async findAllForAdmin(
    @Query() adminKbCategoryListDto: AdminKbFoodCategoryGroupListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<KbFoodCategoryGroup>> {
    return await this.menuAnalysisService.findAll(
      adminKbCategoryListDto,
      pagination,
    );
  }
}
