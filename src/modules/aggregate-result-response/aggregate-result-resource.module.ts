import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultResult } from '../consult-record/consult-record.entity';
import { LocationAnalysisModule } from '../data';
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
    ]),
    LocationAnalysisModule,
  ],
  controllers: [AggregateResultResponseController],
  providers: [AggregateResultResponseService],
  exports: [],
})
export class AggregateResultResponseModule {}
