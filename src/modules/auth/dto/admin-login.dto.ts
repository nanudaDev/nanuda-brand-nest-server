import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { BaseDto } from 'src/core';
import { Admin } from 'src/modules/admin/admin.entity';

export class AdminLoginDto extends BaseDto<AdminLoginDto>
  implements Partial<Admin> {
  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('KR', { message: 'type in the right phone number' })
  @Expose()
  @IsNumberString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Expose()
  rememberMe?: boolean;
}
