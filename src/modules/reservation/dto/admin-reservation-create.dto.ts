import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ReservationCreateDto } from './reservation-create.dto';

export class AdminReservationCreateDto extends ReservationCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  consultId: number;
}
