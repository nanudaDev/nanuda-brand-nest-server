import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeHdongModule } from '../code-hdong/code-hdong.module';
import {
  LocationAnalysisModule,
  PickcookSmallCategoryInfoModule,
  SScoreModule,
} from '../data';
import { CScoreAttributeModule } from '../data/c-score/c-score.module';
import { ProformaEventTrackerService } from '../proforma-event-tracker/proforma-event-tracker.service';
import { ProformaConsultResultV2Controller } from './proforma-consult-result-v2.controller';
import { ProformaConsultResultV2 } from './proforma-consult-result-v2.entity';
import { ProformaConsultResultV2Service } from './proforma-consult-result-v2.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProformaConsultResultV2]),
    CScoreAttributeModule,
    LocationAnalysisModule,
    CodeHdongModule,
    SScoreModule,
    PickcookSmallCategoryInfoModule,
  ],
  controllers: [ProformaConsultResultV2Controller],
  providers: [ProformaConsultResultV2Service, ProformaEventTrackerService],
  exports: [ProformaConsultResultV2Service],
})
export class ProformaConsultResultV2Module {}
