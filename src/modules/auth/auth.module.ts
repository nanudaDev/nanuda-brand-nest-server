import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigService } from 'src/config';
import { Admin } from '../admin/admin.entity';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { PickcookUser } from '../pickcook-user/pickcook-user.entity';
import { AdminAuthController } from './admin-auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PasswordService } from './password.service';
import { PickcookAuthController } from './pickcook-user-auth.controller';
import { PickcookUserPasswordService } from './pickcook-user-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PickcookUser]),
    TypeOrmModule.forFeature([PlatformAdmin], 'platform'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AdminAuthController, PickcookAuthController],
  providers: [
    AuthService,
    PasswordService,
    JwtStrategy,
    PickcookUserPasswordService,
  ],
  exports: [AuthService, PickcookUserPasswordService],
})
export class AuthModule {}
