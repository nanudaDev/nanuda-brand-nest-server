import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProformaEventTracker } from './proforma-event-tracker.entity';
import { ProformaEventTrackerService } from './proforma-event-tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProformaEventTracker])],
  controllers: [],
  providers: [ProformaEventTrackerService],
  exports: [ProformaEventTrackerService],
})
export class ProformaEventTrackerModule {}
