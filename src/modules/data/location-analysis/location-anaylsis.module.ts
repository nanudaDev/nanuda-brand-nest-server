import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HdongCodeNoData } from '../hdong-code-no-data/hdong-code-no-data.entity';
import { LocationAnalysiController } from './location-analysis.controller';
import { LocationAnalysisService } from './location-analysis.service';

@Module({
  imports: [TypeOrmModule.forFeature([HdongCodeNoData])],
  controllers: [LocationAnalysiController],
  providers: [LocationAnalysisService],
  exports: [LocationAnalysisService],
})
export class LocationAnalysisModule {}
