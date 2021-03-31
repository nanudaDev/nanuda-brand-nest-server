import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { Reservation } from '../reservation.entity';

export class ReservationListDto extends BaseDto<ReservationListDto>
  implements Partial<Reservation> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationCode: string;
}
