import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { ConsultResultV2 } from '../consult-result-v2.entity';

export class ConsultResultV2CreateDto extends BaseDto<ConsultResultV2CreateDto>
  implements Partial<ConsultResultV2> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsPhoneNumber('KR', { message: '올바른 전화번호를 입력해주세요' })
  @Expose()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  smsAuthCode: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  proformaConsultResultId: number;
}
