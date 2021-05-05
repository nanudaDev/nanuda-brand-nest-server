import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { BRAND_CONSULT, FNB_OWNER } from 'src/shared';
import { ConsultResultV2 } from '../consult-result-v2.entity';

export class AdminConsultResultV2ListDto
  extends BaseDto<AdminConsultResultV2ListDto>
  implements Partial<ConsultResultV2> {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ enum: BRAND_CONSULT })
  @IsEnum(BRAND_CONSULT)
  @Expose()
  @IsOptional()
  consultStatus?: BRAND_CONSULT;

  @ApiPropertyOptional({ enum: FNB_OWNER })
  @Expose()
  @IsEnum(FNB_OWNER)
  @IsOptional()
  fnbOwnerStatus?: FNB_OWNER;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @Expose()
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @IsEnum(ORDER_BY_VALUE)
  orderById?: ORDER_BY_VALUE;
}
