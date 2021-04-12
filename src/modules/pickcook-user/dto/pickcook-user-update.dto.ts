import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsEmail,
  MinLength,
  Min,
  IsEnum,
} from 'class-validator';
import { IsPassword, IsEqualTo, YN, Default } from '../../../common';
import { BaseDto } from 'src/core';
import { PickcookUser } from '../pickcook-user.entity';

export class PickcookUserUpdateDto extends BaseDto<PickcookUserUpdateDto>
  implements Partial<PickcookUser> {
  @ApiPropertyOptional()
  @IsOptional()
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

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  serviceAgreeYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  privacyAgreeYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  marketingAgreeYn?: YN;
}
