require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { ConsultResult } from 'src/modules/consult-result/consult-result.entity';
import * as Slack from 'slack-node';

enum SLACK_TYPE {
  PICKCOOK_SERVICE = 'PICKCOOK_SERVICE',
}

@Injectable()
export class PickcookSlackNotificationService {
  slack = new Slack();
  slackUrl = process.env.PICKCOOK_NOTIFICATION_CHANNEL;

  async sendAdminConsultNotication(consultData: ConsultResult) {
    const message = {
      text: `픽쿡 상담 신청 안내`,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '신청서 상세보기',
              type: 'button',
              // url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${deliveryFounderConsult.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              title: `픽쿡 상담 신청`,
              value: `${consultData.name} (${consultData.phone})님이 신청을 했습니다.`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  // send notification
  private __send_slack(message: object, slackType?: SLACK_TYPE) {
    // potential slack types
    this.slack.setWebhook(this.slackUrl);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
