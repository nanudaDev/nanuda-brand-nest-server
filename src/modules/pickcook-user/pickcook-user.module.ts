import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookMailerService } from 'src/common';
import { PickcookSlackNotificationService } from 'src/common/utils';
import { PasswordService } from '../auth';
import { PickCookUserHistory } from '../pickcook-user-history/pickcook-user-history.entity';
import { NanudaUser } from '../platform-module/nanuda-user/nanuda-user.entity';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
import { AdminPickcookUserController } from './admin-pickcook-user.controller';
import { CheckPickcookUserController } from './check-pickcook-user.controller';
import { PickcookUserController } from './pickcook-user.controller';
import { PickcookUser } from './pickcook-user.entity';
import { PickcookUserService } from './pickcook-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PickcookUser, PickCookUserHistory]),
    TypeOrmModule.forFeature([NanudaUser], 'platform'),
    SmsNotificationModule,
  ],
  controllers: [
    AdminPickcookUserController,
    CheckPickcookUserController,
    PickcookUserController,
  ],
  providers: [
    PickcookUserService,
    PickcookSlackNotificationService,
    PasswordService,
    PickcookMailerService,
  ],
})
export class PickcookUserModule {}
