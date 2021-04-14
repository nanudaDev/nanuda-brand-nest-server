require('dotenv').config();
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { content } from 'googleapis/build/src/apis/content';
import { BaseService } from 'src/core';
import { PickcookUser } from 'src/modules/pickcook-user/pickcook-user.entity';
import { Reservation } from 'src/modules/reservation/reservation.entity';

const BASE_PATH = 'src/templates/mail';

export class EmailInputs {
  to: string;
  subject: string | '안녕하세여 픽쿡입니다';
  template: string;
  context?: any;
  from?: string | 'noreply@pickcook.kr';
}

@Injectable()
export class PickcookMailerService extends BaseService {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  /**
   * take in email input class as an option parameter
   * @param options
   * @returns
   */
  private async __send_mail(options: EmailInputs) {
    options.from = options.from || process.env.EMAIL_ADDRESS;
    options.template = BASE_PATH + options.template;

    // 노드 메일러로 이메일 발송하기
    try {
      return await this.mailerService.sendMail(options);
    } catch (err) {
      console.log(err);
    }
  }

  // pickcook user

  /**
   * welcome new user
   * @param pickcookUser
   * @returns
   */
  async welcomePickcookUser(pickcookUser: PickcookUser) {
    const newOptions = new EmailInputs();
    newOptions.to = pickcookUser.email;
    newOptions.subject = '픽쿡에 가입해주셔서 감사합니다';
    newOptions.template = '/pickcook-user/welcome-pickcook-user';
    newOptions.context = { pickcookUser };
    return await this.__send_mail(newOptions);
  }

  // reservation
}
