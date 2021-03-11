import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import {
  AGE_GROUP,
  DELIVERY_OR_RESTAURANT,
  FNB_OWNER,
  REVENUE_RANGE,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';
import { AggregateResultResponse } from '../aggregate-result-response.entity';

export class AggregateResultResponseQueryDto
  extends BaseDto<AggregateResultResponseQueryDto>
  implements Partial<AggregateResultResponse> {
  @ApiProperty({ enum: DELIVERY_OR_RESTAURANT })
  @IsNotEmpty()
  @Expose()
  @IsEnum(DELIVERY_OR_RESTAURANT)
  deliveryRatioCode: DELIVERY_OR_RESTAURANT;

  @ApiProperty({ enum: AGE_GROUP })
  @IsNotEmpty()
  @Expose()
  @IsEnum(AGE_GROUP)
  ageGroupCode: AGE_GROUP;

  @ApiPropertyOptional({ enum: REVENUE_RANGE })
  @IsOptional()
  @Expose()
  @IsEnum(REVENUE_RANGE)
  revenueRangeCode?: REVENUE_RANGE;

  @ApiPropertyOptional({ enum: TENTATIVE_OPEN_OPTION })
  @IsOptional()
  @Expose()
  @IsEnum(TENTATIVE_OPEN_OPTION)
  isReadyCode?: TENTATIVE_OPEN_OPTION;

  @ApiProperty({ enum: FNB_OWNER })
  @IsOptional()
  @IsEnum(FNB_OWNER)
  @Expose()
  fnbOwnerStatus: FNB_OWNER;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  hdongCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongName?: string;
}
