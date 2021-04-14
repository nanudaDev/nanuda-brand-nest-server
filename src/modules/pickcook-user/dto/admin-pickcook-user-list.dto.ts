import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { ACCOUNT_STATUS } from 'src/shared';
import { PickcookUser } from '../pickcook-user.entity';

export class AdminPickcookUserListDto extends BaseDto<AdminPickcookUserListDto>
  implements Partial<PickcookUser> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  username?: string;

  @ApiPropertyOptional({ enum: ACCOUNT_STATUS })
  @IsOptional()
  @Expose()
  @IsEnum(ACCOUNT_STATUS)
  accountStatus?: ACCOUNT_STATUS;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderById?: ORDER_BY_VALUE;
}
