import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultBaeminReport } from './consult-baemin-report.entity';
import { AdminConsultBaeminReportController } from './admin-consult-baemin-report.controller';
import { ConsultBaeminReportService } from './consult-baemin-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultBaeminReport])],
  controllers: [AdminConsultBaeminReportController],
  providers: [ConsultBaeminReportService],
  exports: [ConsultBaeminReportService],
})
export class ConsultBaeminReportModule {}
