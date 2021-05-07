import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSlackNotificationService } from 'src/common/utils';
import { SmsNotificationModule } from '..';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import { AdminConsultResultV2Controller } from './admin-consult-result-v2.controller';
import { ConsultResultV2Controller } from './consult-result-v2.controller';
import { ConsultResultV2 } from './consult-result-v2.entity';
import { ConsultResultV2Service } from './consult-result-v2.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultResultV2]),
    SmsNotificationModule,
    TypeOrmModule.forFeature([CodeHdong], 'wq'),
    TypeOrmModule.forFeature([PlatformAdmin], 'platform'),
  ],
  controllers: [AdminConsultResultV2Controller, ConsultResultV2Controller],
  providers: [ConsultResultV2Service, PickcookSlackNotificationService],
  exports: [ConsultResultV2Service],
})
export class ConsultResultV2Module {}
