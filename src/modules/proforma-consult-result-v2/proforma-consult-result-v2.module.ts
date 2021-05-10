import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeHdongModule } from '../code-hdong/code-hdong.module';
import {
  LocationAnalysisModule,
  PickcookSmallCategoryInfoModule,
  SScoreModule,
} from '../data';
import { CScoreAttributeModule } from '../data/c-score/c-score.module';
import { ProformaConsultResultV2Controller } from './proforma-consult-result-v2.controller';
import { ProformaConsultResultV2 } from './proforma-consult-result-v2.entity';
import { ProformaConsultResultV2Service } from './proforma-consult-result-v2.service';
import { ProformaEventTrackerModule } from '../proforma-event-tracker/proforma-event-tracker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProformaConsultResultV2]),
    CScoreAttributeModule,
    LocationAnalysisModule,
    CodeHdongModule,
    SScoreModule,
    PickcookSmallCategoryInfoModule,
    ProformaEventTrackerModule,
  ],
  controllers: [ProformaConsultResultV2Controller],
  providers: [ProformaConsultResultV2Service],
  exports: [ProformaConsultResultV2Service],
})
export class ProformaConsultResultV2Module {}
