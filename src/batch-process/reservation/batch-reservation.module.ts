import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/modules/reservation/reservation.entity';
import { BatchReservationService } from './batch-reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [],
  providers: [BatchReservationService],
  exports: [BatchReservationService],
})
export class BatchReservationModule {}
