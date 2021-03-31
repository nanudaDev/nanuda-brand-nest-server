import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { BaseDto } from 'src/core';

export class ReservationCheckDto extends BaseDto<ReservationCheckDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  reservationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요' })
  phone: string;
}
