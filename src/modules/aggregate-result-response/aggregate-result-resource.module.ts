import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import { CodeHdongModule } from '../code-hdong/code-hdong.module';
import { CommonCodeModule } from '../common-code/common-code.module';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { KbCategoryInfo, LocationAnalysisModule } from '../data';
import { KbDeliverySpacePurchaseRecord } from '../data/entities/kb-delivery-space-purchase-record.entity';
import { KbOfflineSpacePurchaseRecord } from '../data/entities/kb-offline-space-purchase-record.entity';
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
    TypeOrmModule.forFeature(
      [
        KbOfflineSpacePurchaseRecord,
        KbDeliverySpacePurchaseRecord,
        KbCategoryInfo,
      ],
      'wq',
    ),
    LocationAnalysisModule,
    CodeHdongModule,
    CommonCodeModule,
  ],
  controllers: [AggregateResultResponseController],
  providers: [AggregateResultResponseService],
  exports: [AggregateResultResponseService],
})
export class AggregateResultResponseModule {}
