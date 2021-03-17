import { Module } from '@nestjs/common';
import { LocationAnalysiController } from './location-analysis.controller';
import { LocationAnalysisService } from './location-analysis.service';

@Module({
  imports: [],
  controllers: [LocationAnalysiController],
  providers: [LocationAnalysisService],
  exports: [LocationAnalysisService],
})
export class LocationAnalysisModule {}
