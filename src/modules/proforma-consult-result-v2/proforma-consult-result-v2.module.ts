import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeHdongModule } from '../code-hdong/code-hdong.module';
import { LocationAnalysisModule, SScoreModule } from '../data';
import { CScoreAttributeModule } from '../data/c-score/c-score.module';
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
  ],
  controllers: [ProformaConsultResultV2Controller],
  providers: [ProformaConsultResultV2Service],
  exports: [ProformaConsultResultV2Service],
})
export class ProformaConsultResultV2Module {}
