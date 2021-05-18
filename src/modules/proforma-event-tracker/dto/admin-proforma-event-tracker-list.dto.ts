import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { ORDER_BY_VALUE } from '../../../common/interfaces/order-by-value.type';
import { Default } from '../../../common/decorators/default.decorator';
import {
  FNB_OWNER,
  KB_MEDIUM_CATEGORY,
} from '../../../shared/common-code.type';
export class AdminProformaEventTrackerListDto extends BaseDto<
  AdminProformaEventTrackerListDto
> {
  @ApiPropertyOptional({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @IsOptional()
  @Expose()
  proformaFnbOwnerStatus?: FNB_OWNER;

  @ApiPropertyOptional({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @IsOptional()
  @Expose()
  consultFnbOwnerStatus?: FNB_OWNER;

  @ApiPropertyOptional({ enum: KB_MEDIUM_CATEGORY })
  @IsOptional()
  @IsEnum(KB_MEDIUM_CATEGORY)
  @Expose()
  selectedKbMediumCategory?: KB_MEDIUM_CATEGORY;

  @ApiPropertyOptional()
  @Expose()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsOptional()
  orderById?: ORDER_BY_VALUE;
}
