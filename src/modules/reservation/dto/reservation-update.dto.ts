import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { AdminResultResponseCreateDto } from 'src/modules/result-response/dto';
import { AdminReservationUpdateDto } from './admin-reservation-update.dto';

export class ReservationUpdateDto extends AdminReservationUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: '올바른 전화번호를 입력해주세요' })
  phone: string;
}
