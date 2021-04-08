import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { PickcookUserCreateDto, PickcookUserCredentialCheckDto } from './dto';
import { PickcookUser } from './pickcook-user.entity';
import { PickcookUserService } from './pickcook-user.service';

@Controller()
@ApiTags('PICKCOOK USER')
export class PickcookUserController extends BaseController {
  constructor(private readonly pickcookUserService: PickcookUserService) {
    super();
  }

  /**
   * create pickcook user
   * @param pickcookUserCreateDto
   */
  @Post('/pickcook-user')
  async createUser(
    @Body() pickcookUserCreateDto: PickcookUserCreateDto,
  ): Promise<PickcookUser> {
    return await this.pickcookUserService.createPickcookUser(
      pickcookUserCreateDto,
    );
  }
}
