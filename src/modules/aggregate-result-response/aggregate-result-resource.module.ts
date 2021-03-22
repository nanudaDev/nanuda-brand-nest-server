import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeHdongModule } from '../code-hdong/code-hdong.module';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { LocationAnalysisModule } from '../data';
import { ProformaConsultResult } from '../proforma-consult-result/proforma-consult-result.entity';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';
import { QuestionProformaMapper } from '../question-proforma-mapper/question-proforma-mapper.entity';
import { AggregateResultResponseController } from './aggregate-result-resource.controller';
import { AggregateResultResponseService } from './aggregate-result-resource.service';
import { AggregateResultResponseBackup } from './aggregate-result-response-backup.entity';
import { AggregateResultResponse } from './aggregate-result-response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AggregateResultResponse,
      AggregateResultResponseBackup,
      ConsultResult,
      ProformaConsultResult,
      QuestionProformaMapper,
      QuestionProformaGivenMapper,
    ]),
    LocationAnalysisModule,
    CodeHdongModule,
  ],
  controllers: [AggregateResultResponseController],
  providers: [AggregateResultResponseService],
  exports: [AggregateResultResponseService],
})
export class AggregateResultResponseModule {}
