import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultResultV3 } from './consult-result-v3.entity';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
import { PickcookSlackNotificationService } from '../../common/utils/service/pickcook-slack-notification.service';
import { ConsultResultV3Service } from './consult-result-v3.service';
import { ConsultResultV3Controller } from './consult-result-v3.controller';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import { AdminConsultResultV3Controller } from './admin-consult-result-v3.controller';
import { RandomConsultCountTracker } from '../random-consult-count-tracker/random-consult-count-tracker.entity';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { ConsultResultV2 } from '../consult-result-v2/consult-result-v2.entity';
import { ProformaConsultResultV3Module } from '../proforma-consult-result-v3/proforma-consult-result-v3.module';
import { ConsultResultV3MessageLogModule } from '../consult-result-v3-message-log/consult-result-v3-message-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConsultResultV3,
      RandomConsultCountTracker,
      ConsultResult,
      ConsultResultV2,
    ]),
    TypeOrmModule.forFeature([CodeHdong], 'wq'),
    TypeOrmModule.forFeature([PlatformAdmin], 'platform'),
    SmsNotificationModule,
    ProformaConsultResultV3Module,
    ConsultResultV3MessageLogModule,
  ],
  controllers: [AdminConsultResultV3Controller, ConsultResultV3Controller],
  providers: [ConsultResultV3Service, PickcookSlackNotificationService],
  exports: [ConsultResultV3Service],
})
export class ConsultResultV3Module {}
