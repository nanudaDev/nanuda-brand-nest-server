require('dotenv').config();
import Debug from 'debug';
import { Injectable } from '@nestjs/common';
import {
  HandlebarsAdapter,
  MailerOptionsFactory,
  MailerOptions,
} from '@nest-modules/mailer';
import { join, basename } from 'path';

const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

@Injectable()
export class PickcookMailerConfigService implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: process.env.EMAIL_HOST,
        secure: Boolean(process.env.EMAIL_SECURE),
        port: Number(process.env.EMAIL_PORT),
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
        logger: false,
        debug: false,
        service: 'gmail',
      },
      defaults: {
        from: `"픽쿡" <${process.env.EMAIL_ADDRESS}>`,
      },
      template: {
        dir: join(__dirname, '../', 'templates', 'mail'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
