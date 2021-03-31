import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import {
  AGE_GROUP,
  FNB_OWNER,
  HOW_OPERATE,
  HOW_SKILL,
  KB_MEDIUM_CATEGORY,
  REVENUE_RANGE,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';
import { ConsultResult } from '../consult-result.entity';

export class AdminConsultResultListDto
  extends BaseDto<AdminConsultResultListDto>
  implements Partial<ConsultResult> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ enum: FNB_OWNER })
  @IsOptional()
  @IsEnum(FNB_OWNER)
  @Expose()
  fnbOwnerStatus: FNB_OWNER;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsPhoneNumber('KR')
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  aggregateResponseId?: number;

  @ApiPropertyOptional({ enum: AGE_GROUP })
  @IsOptional()
  @IsEnum(AGE_GROUP)
  @Expose()
  ageGroupCode?: AGE_GROUP;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ageGroupGrade?: number;

  @ApiPropertyOptional({ enum: REVENUE_RANGE })
  @IsOptional()
  @Expose()
  @IsEnum(REVENUE_RANGE)
  revenueRangeCode?: REVENUE_RANGE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  revenueRangeGrade?: number;

  @ApiPropertyOptional({ enum: TENTATIVE_OPEN_OPTION })
  @IsOptional()
  @Expose()
  @IsEnum(TENTATIVE_OPEN_OPTION)
  isReadyCode?: TENTATIVE_OPEN_OPTION;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  isReadyGrade?: number;

  @ApiPropertyOptional({ enum: KB_MEDIUM_CATEGORY })
  @IsOptional()
  @Expose()
  @IsEnum(KB_MEDIUM_CATEGORY)
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deliveryRatioGrade?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  reservationCode?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
