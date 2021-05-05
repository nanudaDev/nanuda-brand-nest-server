import { Module } from '@nestjs/common';
import { PickcookSlackNotificationService } from './pickcook-slack-notification.service';

@Module({
  providers: [PickcookSlackNotificationService],
  exports: [PickcookSlackNotificationService],
})
export class PickcookNotificationModule {}
