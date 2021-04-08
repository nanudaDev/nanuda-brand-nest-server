require('dotenv').config();
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PlatformUserSigninPayload, UserSigninPayload, UserType } from '..';
import { AuthService } from '../auth.service';

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
}
