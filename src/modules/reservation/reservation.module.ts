import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { SmsNotificationModule } from '../sms-notification/sms-notification.module';
import { AdminReservationController } from './admin-reservation.controller';
import { ReservationController } from './reservation.controller';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultResult, Reservation]),
    SmsNotificationModule,
  ],
  controllers: [AdminReservationController, ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
