import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RandomConsultCountTracker } from '../../modules/random-consult-count-tracker/random-consult-count-tracker.entity';
import { BatchRandomConsultCountTrackerService } from './batch-random-consult-count-tracker.service';
@Module({
  imports: [TypeOrmModule.forFeature([RandomConsultCountTracker])],
  controllers: [],
  providers: [BatchRandomConsultCountTrackerService],
  exports: [BatchRandomConsultCountTrackerService],
})
export class BatchRandomConsultCountTrackerModule {}
