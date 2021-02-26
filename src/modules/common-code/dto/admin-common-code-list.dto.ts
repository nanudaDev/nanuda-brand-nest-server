import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEAN, IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { CommonCode } from '../common-code.entity';

export class AdminCommonCodeListDto extends BaseDto<AdminCommonCodeListDto>
  implements Partial<CommonCode> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  key?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  category?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsOptional()
  orderById?: ORDER_BY_VALUE;
}
