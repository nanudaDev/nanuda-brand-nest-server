require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { ConsultResult } from 'src/modules/consult-result/consult-result.entity';
import * as Slack from 'slack-node';
import { ConsultResultV2 } from 'src/modules/consult-result-v2/consult-result-v2.entity';

enum SLACK_TYPE {
  PICKCOOK_SERVICE = 'PICKCOOK_SERVICE',
  PICKCOOK_ERROR = 'PICKCOOK_ERROR',
}

@Injectable()
export class PickcookSlackNotificationService {
  slack = new Slack();
  slackUrl: string;

  async sendAdminConsultNotication(consultData: ConsultResult) {
    const message = {
      text: `픽쿡 상담 신청 안내`,
      attachments: [
        {
          // color: '#009900',
          // actions: [
          //   {
          //     name: 'slack action button',
          //     text: '신청서 상세보기',
          //     type: 'button',
          //     // TODO: once URL is set up
          //     // url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${deliveryFounderConsult.no}`,
          //     style: 'primary',
          //   },
          // ],
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
    this.__send_slack(message, SLACK_TYPE.PICKCOOK_SERVICE);
  }

  /**
   * send slack for pickcook consult v2
   * @param consultData
   */
  async sendAdminConsultNoticationV2(consultData: ConsultResultV2) {
    const message = {
      text: `픽쿡 상담 신청 안내`,
      attachments: [
        {
          // color: '#009900',
          // actions: [
          //   {
          //     name: 'slack action button',
          //     text: '신청서 상세보기',
          //     type: 'button',
          //     // TODO: once URL is set up
          //     // url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${deliveryFounderConsult.no}`,
          //     style: 'primary',
          //   },
          // ],
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
    this.__send_slack(message, SLACK_TYPE.PICKCOOK_SERVICE);
  }

  /**
   * send error code
   * @param error
   */
  async sendErrorNotification(error: any) {
    const message = {
      text: `PICKCOOK SERVER ERROR`,
      attachments: [
        {
          // color: '#009900',
          // actions: [
          //   {
          //     name: 'slack action button',
          //     text: '신청서 상세보기',
          //     type: 'button',
          //     // TODO: once URL is set up
          //     // url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${deliveryFounderConsult.no}`,
          //     style: 'primary',
          //   },
          // ],
          fields: [
            {
              title: `PICKCOOK SERVER ERROR DETAILS`,
              value: `${error.code}`,
              short: false,
            },
          ],
        },
      ],
    };
  }

  // send notification
  private __send_slack(message: object, slackType?: SLACK_TYPE) {
    // potential slack types
    if (slackType === SLACK_TYPE.PICKCOOK_SERVICE)
      this.slackUrl = process.env.PICKCOOK_NOTIFICATION_CHANNEL;
    if (this.slackUrl === SLACK_TYPE.PICKCOOK_ERROR)
      this.slackUrl = process.env.PICKCOOK_ERROR_NOTIFICATION_SLACK_URL;
    this.slack.setWebhook(this.slackUrl);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
