import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MinLength } from 'class-validator';
import { IsEqualTo, IsPassword } from '../../../common';

export class PickcookUserPasswordUpdateDto {
  @ApiProperty()
  @IsPassword()
  @MinLength(8)
  @Expose()
  password: string;

  @ApiProperty()
  @IsPassword()
  @IsEqualTo('password')
  @Expose()
  @MinLength(8)
  passwordCheck: string;
}
