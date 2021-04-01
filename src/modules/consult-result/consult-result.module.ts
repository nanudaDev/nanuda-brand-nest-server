import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSlackNotificationService } from 'src/common/utils';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
import { AdminConsultResponseController } from './admin-consult-result.controller';
import { ConsultResultController } from './consult-result.controller';
import { ConsultResult } from './consult-result.entity';
import { ConsultResultService } from './consult-result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultResult]),
    SmsNotificationModule,
    TypeOrmModule.forFeature([CodeHdong], 'wq'),
    TypeOrmModule.forFeature([PlatformAdmin], 'platform'),
  ],
  controllers: [AdminConsultResponseController, ConsultResultController],
  providers: [ConsultResultService, PickcookSlackNotificationService],
  exports: [ConsultResultService],
})
export class ConsultResultModule {}
