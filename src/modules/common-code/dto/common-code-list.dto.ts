import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { COMMON_CODE_CATEGORY } from 'src/shared';
import { CommonCode } from '../common-code.entity';

export class CommonCodeListDto extends BaseDto<CommonCodeListDto>
  implements Partial<CommonCode> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  key?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  value?: string;

  @ApiPropertyOptional({ enum: COMMON_CODE_CATEGORY })
  @IsOptional()
  @Expose()
  @IsEnum(COMMON_CODE_CATEGORY)
  category?: COMMON_CODE_CATEGORY;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsOptional()
  orderById?: ORDER_BY_VALUE;
}
