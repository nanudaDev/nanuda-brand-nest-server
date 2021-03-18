require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { ConsultResult } from '../consult-result/consult-result.entity';
import * as aligoapi from 'aligoapi';
import { ENVIRONMENT } from 'src/config';

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
  // send to user to notify
  async sendConsultNotification(consultData: ConsultResult, req: Request) {
    const smsContent = await this.__get_auth_body();
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
}
