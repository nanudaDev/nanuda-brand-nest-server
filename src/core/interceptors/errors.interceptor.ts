require('dotenv').config();
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  BadRequestException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Slack from 'slack-node';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  slack = new Slack();
  slackUrl: string;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    return next.handle().pipe(
      catchError(err => {
        // if (err && err instanceof Error) {
        //   console.log(err);
        //   console.log('err.name', err.name);
        //   console.log('err.message', err.message);
        //   return throwError(new BadRequestException());
        // }
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
                  value: `path: ${req.url}\nmethod: ${req.method}\nerror: ${err}`,
                  short: false,
                },
              ],
            },
          ],
        };
        this.__send_slack(message);
        return throwError(err);
      }),
    );
  }
  private __send_slack(message: object) {
    this.slackUrl = process.env.PICKCOOK_ERROR_NOTIFICATION_SLACK_URL;
    this.slack.setWebhook(this.slackUrl);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
