import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AuthService } from './auth.service';
import { PickcookUserLoginDto } from './dto';

@Controller()
@ApiTags('PICKCOOK AUTH')
export class PickcookAuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * login user
   */
  @Post('/auth/pickcook-user')
  async login(@Body() pickcookUserLoginDto: PickcookUserLoginDto) {
    return await this.authService.pickcookLogin(pickcookUserLoginDto);
  }
}
