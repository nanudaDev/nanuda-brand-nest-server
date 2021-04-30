import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { KB_FOOD_CATEGORY, KB_MEDIUM_CATEGORY } from 'src/shared';
import { SScoreDelivery, SScoreRestaurant } from '../../entities';

export class SScoreListDto extends BaseDto<SScoreListDto>
  implements Partial<SScoreRestaurant> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  hdongCode: number;

  @ApiPropertyOptional({ enum: KB_MEDIUM_CATEGORY })
  @IsEnum(KB_MEDIUM_CATEGORY)
  @Expose()
  @IsOptional()
  mediumCategoryCode?: KB_MEDIUM_CATEGORY;
}
