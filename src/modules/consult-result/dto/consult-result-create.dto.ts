import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { BaseDto } from 'src/core';
import { ConsultResult } from '../consult-result.entity';

export class ConsultResultResponseCreateDto
  extends BaseDto<ConsultResultResponseCreateDto>
  implements Partial<ConsultResult> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요' })
  @Expose()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  smsAuthCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  proformaConsultResultId: number;
}
