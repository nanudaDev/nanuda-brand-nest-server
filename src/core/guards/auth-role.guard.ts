require('dotenv').config();
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCOUNT_STATUS, ADMIN_ROLES } from 'src/shared';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ENVIRONMENT } from 'src/config';
import Debug from 'debug';
import { basename } from 'path';
import { PickcookUser } from 'src/modules/pickcook-user/pickcook-user.entity';

const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContextHost) {
    if (err || !user) {
      if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
        console.log(err, 'err');
      }
      throw err ||
        new UnauthorizedException({
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
          error: 401,
        });
    }
    if (user.accountStatus !== ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE) {
      throw new ForbiddenException();
    }
    return user;
  }
}
