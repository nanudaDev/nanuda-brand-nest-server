require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { YN } from 'src/common';
import { ConsultResult } from '../consult-result/consult-result.entity';
import * as aligoapi from 'aligoapi';
import { ENVIRONMENT } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SmsAuth } from './nanuda-sms-notification.entity';
import { Repository } from 'typeorm';
import { SmsAuthNotificationDto } from './dto';
import { BrandAiException } from 'src/core';
import { UserType } from '../auth';
import { Reservation } from '../reservation/reservation.entity';

class AligoAuth {
  key: string;
  user_id: string;
  testmode_yn: YN | string;
}

class MessageObject {
  auth: AligoAuth;
  body: SmsBody;
}

class SmsBody {
  receiver?: string;
  sender: string;
  msg?: string;
  title?: string;
}

@Injectable()
export class SmsNotificationService {
  constructor(
    @InjectRepository(SmsAuth, 'platform')
    private readonly smsAuthRepo: Repository<SmsAuth>,
  ) {}

  /**
   * 사용자에게 예약 알림
   * @param reservation
   * @param req
   */
  async sendReservationCreateNotification(
    reservation: Reservation,
    req?: Request,
    isUpdated?: YN,
  ) {
    if (isUpdated === YN.NO) {
      const smsContent = await this.__get_auth_body();
      smsContent.body.receiver = reservation.phone;
      smsContent.body.msg = `Link: ${process.env.PICKCOOK_SITE_URL}reservation?reservationCode=${reservation.reservationCode}`;
      console.log(smsContent.body.msg);
    } else {
      const smsContent = await this.__get_auth_body();
      smsContent.body.receiver = reservation.phone;
      smsContent.body.msg = `Link: ${process.env.PICKCOOK_SITE_URL}reservation?reservationCode=${reservation.reservationCode}`;
      console.log(smsContent.body.msg);
    }
  }

  // send to user to notify
  // TODO: add reservation code
  async sendConsultNotification(consultData: ConsultResult, req: Request) {
    const smsContent = await this.__get_auth_body();
    console.log(
      `${process.env.PICKCOOK_SITE_URL}reservation?reservationCode=${consultData.reservationCode}`,
    );
    smsContent.body.receiver = consultData.phone;
    smsContent.body.msg = `안녕하세요, ${consultData.name}님. 픽쿡입니다.\n신청해주셔서 감사합니다.\n현재 전문 상담사가 배정되어 빠른 시간 내로 연락드리겠습니다.\n감사합니다.`;
    req.body = smsContent.body;
    const sms = await aligoapi.send(req, smsContent.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(sms);
    }
  }

  /**
   * get auth
   */
  private async __get_auth_body(): Promise<MessageObject> {
    const auth = new AligoAuth();
    auth.user_id = process.env.ALIGO_USER_ID;
    auth.key = process.env.ALIGO_API_KEY;
    auth.testmode_yn = process.env.ALIGO_TESTMODE;
    const body = new SmsBody();
    body.sender = process.env.ALIGO_SENDER_PHONE;
    body.title = '안녕하세요, 픽쿡입니다.';

    return { auth, body };
  }

  /**
   * check code
   * @param companyUserSmsAuthCheckDto
   */
  async registerCode(
    smsAuthNotificationDto: SmsAuthNotificationDto,
    req?: Request,
  ) {
    const smsAuth = new SmsAuth();
    let newAuthCode = Math.floor(100000 + Math.random() * 900000);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      // for test case only
      newAuthCode = 123456;
    }

    smsAuth.phone = smsAuthNotificationDto.phone;
    smsAuth.authCode = newAuthCode;
    smsAuth.userType = UserType.PICKCOOK_USER;
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(smsAuth.authCode);
    }
    await this.smsAuthRepo.save(smsAuth);
    await this.__send_login_prompt(
      req,
      newAuthCode,
      smsAuthNotificationDto.phone,
    );
    return true;
  }

  /**
   * check code
   * @param phone
   * @param code
   */
  async checkCode(smsAuthNotificationDto: SmsAuthNotificationDto) {
    const checkCode = await this.smsAuthRepo.findOne({
      authCode: smsAuthNotificationDto.smsAuthCode,
      phone: smsAuthNotificationDto.phone,
    });
    if (!checkCode) {
      throw new BrandAiException('smsAuth.notFound');
    }
    return true;
  }

  /**
   * send auth code
   * @param req
   * @param newAuthCode
   * @param phone
   */
  private async __send_login_prompt(
    req: Request,
    newAuthCode: number,
    phone: string,
  ) {
    const smsContent = await this.__get_auth_body();
    smsContent.body.receiver = phone;
    smsContent.body.msg = `안녕하세요, 픽쿡입니다. 신청하기 위한 인증번호는 [${newAuthCode}]입니다.`;
    req.body = smsContent.body;
    const sms = await aligoapi.send(req, smsContent.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(sms);
      console.log(smsContent);
    }
  }
}
