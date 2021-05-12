import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProformEventTrackerController } from './admin-proform-event-tracker.controller';
import { ProformaEventTracker } from './proforma-event-tracker.entity';
import { ProformaEventTrackerService } from './proforma-event-tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProformaEventTracker])],
  controllers: [AdminProformEventTrackerController],
  providers: [ProformaEventTrackerService],
  exports: [ProformaEventTrackerService],
})
export class ProformaEventTrackerModule {}
