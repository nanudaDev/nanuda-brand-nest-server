import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { PickcookUserCredentialCheckDto } from './dto';
import { PickcookUserService } from './pickcook-user.service';

@Controller()
@ApiTags('PICKCOOK USER')
export class CheckPickcookUserController extends BaseController {
  constructor(private readonly pickcookUserService: PickcookUserService) {
    super();
  }

  /**
   * check if phone applied
   * @param pickcookCredentialDto
   */
  @Get('/pickcook-user/check-phone')
  async checkPhone(
    @Query() pickcookCredentialDto: PickcookUserCredentialCheckDto,
  ) {
    return await this.pickcookUserService.checkPhone(
      pickcookCredentialDto.phone,
    );
  }

  /**
   * check if email has applied
   * @param pickcookCredentialDto
   */
  @Get('/pickcook-user/check-email')
  async checkEmail(
    @Query() pickcookCredentialDto: PickcookUserCredentialCheckDto,
  ) {
    return await this.pickcookUserService.checkEmail(
      pickcookCredentialDto.email,
    );
  }

  /**
   * check if username has applied
   * @param pickcookCredentialDto
   */
  @Get('/pickcook-user/check-username')
  async checkUsername(
    @Query() pickcookCredentialDto: PickcookUserCredentialCheckDto,
  ) {
    return await this.pickcookUserService.checkUserName(
      pickcookCredentialDto.username,
    );
  }
}
