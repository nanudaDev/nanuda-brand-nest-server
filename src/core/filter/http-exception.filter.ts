// import { BadFieldsException } from '../errors/bad-fields.exception';
require('dotenv').config();
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import {
  BaseException,
  ErrorResponse,
  ERROR_TYPE,
  FieldError,
} from '../errors';
//   import { I18nService } from 'nestjs-i18n';
import * as error from '../../locales/kr/errors.json';
import * as Slack from 'slack-node';
// import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  slack = new Slack();
  slackUrl: string;
  //   async trans(code: string, args?: object, defaultMessage?: string) {
  //     try {
  //       const message: any = await this.i18n.translate(`errors.${code}`, {
  //         args,
  //       });
  //       console.log(args);
  //       console.log(message, 'test');
  //       return `errors.${code}` === message ? defaultMessage : message;
  //     } catch (e) {
  //       console.log(e);
  //       return defaultMessage;
  //     }
  //     // return defaultMessage;
  //   }

  makeValidationError(
    errors: { [key: string]: FieldError },
    validationErrors: ValidationError[],
    property?: string,
  ) {
    console.log('makeValidationError :: --- ', validationErrors);
    return validationErrors.reduce((acc, cur, i) => {
      const key = property ? `${property}.${cur.property}` : cur.property;
      if (cur.children.length > 0) {
        this.makeValidationError(acc, cur.children as ValidationError[], key);
      } else {
        const k = Object.keys(cur.constraints)[0];
        const message = `validator.${key}.${k}`;
        acc[key] = { validator: k, message };
        console.log(acc);
      }
      return acc;
    }, errors);
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let errorResponse: ErrorResponse;

    if (exception instanceof BaseException) {
      errorResponse = exception.getResponse();
      const errorType = errorResponse.code.split('.')[0];
      const errorKind = errorResponse.code.split('.')[1];
      errorResponse.message = await error[errorType][errorKind];
    } else if (exception instanceof BadRequestException) {
      // only validation.pipe
      const response = exception.getResponse() as any;
      console.log('response : ', response, response.message);
      const validationErrors = response.message as ValidationError[];
      const errors = this.makeValidationError({}, validationErrors);

      errorResponse = {
        code: 'validator',
        type: ERROR_TYPE.VALIDATOR,
        statusCode: exception.getStatus(),
        message: errors[Object.keys(errors)[0]].message,
        errors,
      };
    } else {
      errorResponse = {
        code: exception.name,
        type: ERROR_TYPE.SERVER,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message.error,
        errorLocale: `${errorResponse.code.split('.')[0]} - ${
          errorResponse.code.split('.')[1]
        }`,
      };
    }

    if (errorResponse.type === ERROR_TYPE.SERVER) {
      console.log(errorResponse);
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
                value: `${errorResponse.code}\nreq: ${req}`,
                short: false,
              },
            ],
          },
        ],
      };
      this.__send_slack(message);
    }

    res.status(exception.getStatus()).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
    return;
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
