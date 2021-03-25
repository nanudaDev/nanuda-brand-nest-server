import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KbDeliverySpacePurchaseRecord } from '../entities/kb-delivery-space-purchase-record.entity';
import { KbOfflineSpacePurchaseRecord } from '../entities/kb-offline-space-purchase-record.entity';
import { HdongCodeNoData } from '../hdong-code-no-data/hdong-code-no-data.entity';
import { LocationAnalysiController } from './location-analysis.controller';
import { LocationAnalysisService } from './location-analysis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HdongCodeNoData]),
    TypeOrmModule.forFeature(
      [KbOfflineSpacePurchaseRecord, KbDeliverySpacePurchaseRecord],
      'wq',
    ),
  ],
  controllers: [LocationAnalysiController],
  providers: [LocationAnalysisService],
  exports: [LocationAnalysisService],
})
export class LocationAnalysisModule {}
