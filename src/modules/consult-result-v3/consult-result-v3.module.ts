import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultResultV3 } from './consult-result-v3.entity';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
import { PickcookSlackNotificationService } from '../../common/utils/service/pickcook-slack-notification.service';
import { ConsultResultV3Service } from './consult-result-v3.service';
import { ConsultResultV3Controller } from './consult-result-v3.controller';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CodeHdong } from '../code-hdong/code-hdong.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultResultV3]),
    TypeOrmModule.forFeature([CodeHdong], 'wq'),
    TypeOrmModule.forFeature([PlatformAdmin], 'platform'),
    SmsNotificationModule,
  ],
  controllers: [ConsultResultV3Controller],
  providers: [ConsultResultV3Service, PickcookSlackNotificationService],
  exports: [ConsultResultV3Service],
})
export class ConsultResultV3Module {}
