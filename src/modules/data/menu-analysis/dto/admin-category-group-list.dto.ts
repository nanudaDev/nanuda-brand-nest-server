import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEAN, IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { KB_FOOD_CATEGORY } from 'src/shared';
import { KbFoodCategoryGroup } from '../../entities';

export class AdminKbFoodCategoryGroupListDto
  extends BaseDto<AdminKbFoodCategoryGroupListDto>
  implements Partial<KbFoodCategoryGroup> {
  @ApiPropertyOptional({ enum: KB_FOOD_CATEGORY })
  @IsOptional()
  @Expose()
  @IsEnum(KB_FOOD_CATEGORY)
  mediumCategoryNm?: KB_FOOD_CATEGORY;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sSmallCategoryNm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediumCategoryCd?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediumSmallCategoryNm?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
