import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProformaConsultResultV3 } from './proforma-consult-result-v3.entity';
import { ProformaEventTrackerModule } from '../proforma-event-tracker/proforma-event-tracker.module';
import { ProformaConsultResultV3Service } from './proforma-consult-result-v3.service';
import { ProformaConsultResultV3Controller } from './proforma-consult-result-v3.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProformaConsultResultV3]),
    ProformaEventTrackerModule,
  ],
  controllers: [ProformaConsultResultV3Controller],
  providers: [ProformaConsultResultV3Service],
  exports: [ProformaConsultResultV3Service],
})
export class ProformaConsultResultV3Module {}
