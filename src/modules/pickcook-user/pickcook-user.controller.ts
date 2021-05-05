import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common';
import {
  AuthRolesGuard,
  BaseController,
  PlatformAuthRolesGuard,
} from 'src/core';
import {
  PickcookUserCreateDto,
  PickcookUserCredentialCheckDto,
  PickcookUserUpdateDto,
} from './dto';
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

  /**
   * update pickcook user
   * @param id
   * @param pickcookUserUpdateDto
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard())
  @Patch('/pickcook-user')
  async updateUser(
    @UserInfo() user: PickcookUser,
    @Body() pickcookUserUpdateDto: PickcookUserUpdateDto,
  ) {
    return await this.pickcookUserService.updatePickcookUser(
      user.id,
      pickcookUserUpdateDto,
    );
  }

  /**
   * find me
   * @param pickcookUser
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard())
  @Get('/pickcook-user/find-me')
  async findMe(@UserInfo() pickcookUser: PickcookUser): Promise<PickcookUser> {
    return await this.pickcookUserService.findOne(pickcookUser.id);
  }

  /**
   * withdraw user
   * 회원 탈퇴
   * @param user
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard())
  @Delete('/pickcook-user/withdraw')
  async withdraw(@UserInfo() user: PickcookUser) {
    return {
      isDeleted: await this.pickcookUserService.hardDeleteUser(user.id),
    };
  }
}
