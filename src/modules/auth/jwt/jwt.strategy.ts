require('dotenv').config();
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PickcookUser } from 'src/modules/pickcook-user/pickcook-user.entity';
import { PlatformUserSigninPayload, UserSigninPayload, UserType } from '..';
import { AuthService } from '../auth.service';
import { PickcookUserSigninPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * validate user
   * @param payload
   */
  async validate(payload: PlatformUserSigninPayload): Promise<any> {
    console.log(payload);
    const user = await this.authService.validatePlatforAdminById(payload._no);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validatePickcookUser(
    payload: PickcookUserSigninPayload,
  ): Promise<PickcookUser> {
    const user = await this.authService.validatePickcookUserById(payload._id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
