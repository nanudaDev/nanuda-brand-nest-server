import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEAN,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Default } from 'src/common';
import { BaseDto } from 'src/core';
import { ADMIN_ROLES, ADMIN_STATUS } from 'src/shared';
import { Admin } from '../admin.entity';

export class AdminCreateDto extends BaseDto<AdminCreateDto>
  implements Partial<Admin> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: 'Type the correct phone format' })
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @Expose()
  @Default(ADMIN_STATUS.WAITING)
  @IsOptional()
  adminStatus?: ADMIN_STATUS;

  @ApiPropertyOptional({ isArray: true, enum: ADMIN_ROLES })
  @IsOptional()
  @Expose()
  @Default([ADMIN_ROLES.ADMIN_NORMAL])
  userRoles?: ADMIN_ROLES[];
}
