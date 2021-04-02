import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { Reservation } from '../reservation.entity';
import { RESERVATION_HOURS } from '../../../shared';

export class ReservationCreateDto extends BaseDto<ReservationCreateDto>
  implements Partial<Reservation> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationTime: RESERVATION_HOURS;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationCode: string;
}
