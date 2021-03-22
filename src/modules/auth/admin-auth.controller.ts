import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto';

@Controller()
@ApiTags('ADMIN AUTH')
export class AdminAuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * admin login
   * @param adminLoginDto
   */
  @Post('/auth/admin')
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return await this.authService.adminLogin(adminLoginDto);
  }
}
