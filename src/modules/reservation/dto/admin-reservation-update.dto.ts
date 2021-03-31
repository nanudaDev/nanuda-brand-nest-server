import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { Reservation } from '../reservation.entity';
import { AdminReservationCreateDto } from './admin-reservation-create.dto';

export class AdminReservationUpdateDto
  extends BaseDto<AdminReservationUpdateDto>
  implements Partial<Reservation> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  reservationDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  reservationTime?: string;
}
