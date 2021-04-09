import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminCreateDto } from './dto';

@Controller()
@ApiTags('ADMIN')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  /**
   * create new admin
   * @param adminCreateDto
   */
  @Post('/admin')
  async create(@Body() adminCreateDto: AdminCreateDto): Promise<Admin> {
    return await this.adminService.createAdmin(adminCreateDto);
  }

  /**
   * find one admin
   * @param id
   */
  @Get('/admin/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() admin: Admin,
  ): Promise<Admin> {
    console.log(admin);
    return await this.adminService.findOne(id);
  }
}
