import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSlackNotificationService } from 'src/common/utils';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
import { AdminConsultResponseController } from './admin-consult-result.controller';
import { ConsultResultController } from './consult-result.controller';
import { ConsultResult } from './consult-result.entity';
import { ConsultResultService } from './consult-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultResult]), SmsNotificationModule],
  controllers: [AdminConsultResponseController, ConsultResultController],
  providers: [ConsultResultService, PickcookSlackNotificationService],
  exports: [ConsultResultService],
})
export class ConsultResultModule {}
