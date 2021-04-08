import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSlackNotificationService } from 'src/common/utils';
import { PickCookUserHistory } from '../pickcook-user-history/pickcook-user-history.entity';
import { NanudaUser } from '../platform-module/nanuda-user/nanuda-user.entity';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
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
  controllers: [CheckPickcookUserController, PickcookUserController],
  providers: [PickcookUserService, PickcookSlackNotificationService],
})
export class PickcookUserModule {}
