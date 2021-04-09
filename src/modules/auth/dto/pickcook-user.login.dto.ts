import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Default, IsPassword } from 'src/common';
import { BaseDto } from 'src/core';
import { PickcookUser } from 'src/modules/pickcook-user/pickcook-user.entity';

export class PickcookUserLoginDto implements Partial<PickcookUser> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  loginCredential?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @IsPassword()
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(false)
  isUsername?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(false)
  rememberMe?: boolean;
}
