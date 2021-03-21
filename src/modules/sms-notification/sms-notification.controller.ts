import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import { SmsAuthNotificationDto } from './dto';
import { SmsNotificationService } from './sms-notification.service';

@Controller()
@ApiTags('SMS NOTIFICATION')
export class SmsNotifcationController extends BaseController {
  constructor(private readonly smsNotificationService: SmsNotificationService) {
    super();
  }

  /**
   * register code
   * @param smsAuthNotificationDto
   * @param req
   */
  @Post('/sms-notification/register-code')
  async registerCode(
    @Body() smsAuthNotificationDto: SmsAuthNotificationDto,
    @Req() req: Request,
  ) {
    return await this.smsNotificationService.registerCode(
      smsAuthNotificationDto,
      req,
    );
  }
}
