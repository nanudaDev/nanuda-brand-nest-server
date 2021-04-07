import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { RESERVATION_DELETE_REASON } from '../reservation.entity';

export class ReservationDeleteReasonDto {
  @ApiPropertyOptional({})
  @IsOptional()
  @Expose()
  deleteReason?: RESERVATION_DELETE_REASON | string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deleteReasonEtc?: string;
}
