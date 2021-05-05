import { Body, Controller, Get, UseGuards, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common';
import { BaseController, PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_STATUS, CONST_ADMIN_USER } from 'src/shared';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { GlobalSiteConstructionCreateDto } from './dto';
import { GlobalService } from './global.service';
import { SiteInServiceRecord } from './site-in-service-record.entity';

@Controller()
@ApiTags('GLOBAL')
export class GlobalController extends BaseController {
  constructor(private readonly globalService: GlobalService) {
    super();
  }

  /**
   * check if server is running
   * @returns
   */
  @Get('/global/check-server-run')
  async checkServerRun() {
    return await this.globalService.checkCurrentStatus();
  }

  /**
   * create new ticket for admin
   * @param admin
   * @param siteConstructionCreateDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
  @Post('/global/create-ticket')
  async createTicket(
    @UserInfo() admin: PlatformAdmin,
    @Body() siteConstructionCreateDto: GlobalSiteConstructionCreateDto,
  ): Promise<SiteInServiceRecord> {
    return await this.globalService.create(admin.no, siteConstructionCreateDto);
  }
}
