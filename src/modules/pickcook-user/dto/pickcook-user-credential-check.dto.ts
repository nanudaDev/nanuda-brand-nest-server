import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { BaseDto } from 'src/core';
import { PickcookUser } from '../pickcook-user.entity';

export class PickcookUserCredentialCheckDto
  extends BaseDto<PickcookUserCredentialCheckDto>
  implements Partial<PickcookUser> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('KR')
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  username?: string;
}
