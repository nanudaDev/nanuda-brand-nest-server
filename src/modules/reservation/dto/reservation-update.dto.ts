import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { AdminResultResponseCreateDto } from 'src/modules/result-response/dto';

export class ReservationUpdateDto extends AdminResultResponseCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationCode: string;
}
