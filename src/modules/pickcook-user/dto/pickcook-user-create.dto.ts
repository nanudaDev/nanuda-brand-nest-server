import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Min,
  MinLength,
} from 'class-validator';
import { Default, IsEqualTo, IsPassword, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { PickcookUser } from '../pickcook-user.entity';

export class PickcookUserCreateDto extends BaseDto<PickcookUserCreateDto>
  implements Partial<PickcookUser> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요' })
  @Expose()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @MinLength(8)
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPassword()
  @Min(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEqualTo('password')
  passwordCheck: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  serviceAgreeYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  privacyAgreeYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  marketingAgreeYn?: YN;
}
