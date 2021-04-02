import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { Reservation } from '../reservation.entity';

export class ReservationCheckTimeDto extends BaseDto<ReservationCheckTimeDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationDate: Date;
}
