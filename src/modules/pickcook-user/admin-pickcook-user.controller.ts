import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common';
import { BaseController, PlatformAuthRolesGuard } from 'src/core';
import { CONST_ADMIN_USER } from 'src/shared';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { AdminPickcookUserCreateDto, AdminPickcookUserUpdateDto } from './dto';
import { PickcookUser } from './pickcook-user.entity';
import { PickcookUserService } from './pickcook-user.service';

@Controller()
@ApiTags('ADMIN PICKCOOK USER')
@ApiBearerAuth()
@UseGuards(new PlatformAuthRolesGuard(...CONST_ADMIN_USER))
export class AdminPickcookUserController extends BaseController {
  constructor(private readonly pickcookUserService: PickcookUserService) {
    super();
  }

  /**
   * create pickcook user for admin
   * @param adminPickcookUserCreateDto
   * @param admin
   */
  @Post('/admin/pickcook-user')
  async create(
    @Body() adminPickcookUserCreateDto: AdminPickcookUserCreateDto,
    @UserInfo() admin: PlatformAdmin,
  ): Promise<PickcookUser> {
    return await this.pickcookUserService.createPickcookUser(
      adminPickcookUserCreateDto,
      admin.no,
    );
  }

  /**
   * update for admin
   * @param id
   * @param adminPickcookUserUpdateDto
   * @param admin
   * @returns
   */
  @Patch('/admin/pickcook-user/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminPickcookUserUpdateDto: AdminPickcookUserUpdateDto,
    @UserInfo() admin: PlatformAdmin,
  ) {
    return await this.pickcookUserService.updatePickcookUser(
      id,
      adminPickcookUserUpdateDto,
      admin.no,
    );
  }

  /**
   * hard delete user
   * @param id
   */
  @Delete('/admin/pickcook-user/:id([0-9]+)')
  async hardDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.pickcookUserService.hardDeleteUser(id);
  }
}
