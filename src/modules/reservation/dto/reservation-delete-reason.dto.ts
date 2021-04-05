import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ReservationDeleteReasonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deleteReason?: string;
}
