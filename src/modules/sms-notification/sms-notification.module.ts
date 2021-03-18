import { Module } from '@nestjs/common';
import { SmsNotificationService } from './sms-notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SmsNotificationService],
  exports: [SmsNotificationService],
})
export class SmsNotificationModule {}
