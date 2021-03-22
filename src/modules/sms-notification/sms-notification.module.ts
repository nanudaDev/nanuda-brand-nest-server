import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsAuth } from './nanuda-sms-notification.entity';
import { SmsNotifcationController } from './sms-notification.controller';
import { SmsNotificationService } from './sms-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmsAuth], 'platform')],
  controllers: [SmsNotifcationController],
  providers: [SmsNotificationService],
  exports: [SmsNotificationService],
})
export class SmsNotificationModule {}
