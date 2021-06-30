import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { BaseController } from '../../../core/base.controller';
import { PickcookSmallCategoryInfo } from '../entities';
import { AdminPickcookSmallCategoryInfoQueryDto } from './dto';
import { PickcookSmallCategoryService } from './pickcook-small-category-info.service';
@Controller('v3')
@ApiBearerAuth()
@ApiTags('ADMIN PICKCOOK SMALL CATEGORY INFO')
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminPickcookSmallCategoryInfoController extends BaseController {
  constructor(
    private readonly pickcookSmallCategoryInfoService: PickcookSmallCategoryService,
  ) {
    super();
  }

  /**
   * find one small category code
   * @param smallCategoryCode
   * @returns
   */
  @Get('/admin/pickcook-small-category-info')
  async findOneSmallCategoryInfo(
    @Query()
    adminPickcookSmallCategoryQueryDto: AdminPickcookSmallCategoryInfoQueryDto,
  ): Promise<PickcookSmallCategoryInfo> {
    return await this.pickcookSmallCategoryInfoService.findOne(
      adminPickcookSmallCategoryQueryDto.sSmallCategoryCode,
    );
  }
}
