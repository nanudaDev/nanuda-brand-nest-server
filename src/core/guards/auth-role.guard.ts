require('dotenv').config();
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ADMIN_ROLES } from 'src/shared';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ENVIRONMENT } from 'src/config';
import Debug from 'debug';
import { basename } from 'path';

const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);

@Injectable()
export class AuthRolesGuard extends AuthGuard('jwt') {
  readonly roles: ADMIN_ROLES[];
  constructor(...roles: ADMIN_ROLES[]) {
    super();
    this.roles = roles;
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
    if (this.roles.length) {
      debug(this.roles);
      const hasRole = () =>
        this.roles.some(role => user.userRoles.includes(role));

      if (!user.userRoles || !hasRole()) {
        throw new ForbiddenException();
      }
    }
    return user;
  }
}
