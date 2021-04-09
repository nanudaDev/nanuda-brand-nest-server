import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import {
  PickcookUserCheckPasswordDto,
  PickcookUserPasswordUpdateDto,
} from '../pickcook-user/dto';
import { PickcookUser } from '../pickcook-user/pickcook-user.entity';
import { AuthService } from './auth.service';
import { PickcookUserLoginDto } from './dto';
import { PickcookUserPasswordService } from './pickcook-user-password.service';

@Controller()
@ApiTags('PICKCOOK AUTH')
export class PickcookAuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly pickcookUserPasswordService: PickcookUserPasswordService,
  ) {
    super();
  }

  /**
   * login user
   */
  @Post('/auth/pickcook-user/login')
  async login(@Body() pickcookUserLoginDto: PickcookUserLoginDto) {
    return await this.authService.pickcookLogin(pickcookUserLoginDto);
  }

  /**
   * forgot password
   * @param param0
   */
  @Post('/auth/pickcook-user/forgot-password')
  async forgotPassword(@Body() email: { email: string }) {
    return await this.pickcookUserPasswordService.forgotPasswordPickcookUser(
      email.email,
    );
  }

  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard())
  @Post('/auth/pickcook-user/check-password')
  async checkPassword(
    @UserInfo() user: PickcookUser,
    @Body() pickcookUserPasswordCheckDto: PickcookUserCheckPasswordDto,
  ) {
    return await this.pickcookUserPasswordService.checkPassword(
      user.id,
      pickcookUserPasswordCheckDto,
    );
  }

  /**
   * change password
   * @param user
   * @param pickcookUserPasswordUpdateDto
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard())
  @Patch('/auth/pickcook-user/change-password')
  async changePassword(
    @UserInfo() user: PickcookUser,
    pickcookUserPasswordUpdateDto: PickcookUserPasswordUpdateDto,
  ) {
    return await this.pickcookUserPasswordService.updatePassword(
      user.id,
      pickcookUserPasswordUpdateDto,
    );
  }
}
