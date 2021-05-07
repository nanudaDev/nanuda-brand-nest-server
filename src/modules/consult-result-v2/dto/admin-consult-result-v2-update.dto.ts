import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { BRAND_CONSULT } from 'src/shared';
import { ConsultResultV2 } from '../consult-result-v2.entity';

export class AdminConsultResultV2UpdateDto
  extends BaseDto<AdminConsultResultV2UpdateDto>
  implements Partial<ConsultResultV2> {
  @ApiPropertyOptional({ enum: BRAND_CONSULT })
  @IsEnum(BRAND_CONSULT)
  @Expose()
  @IsOptional()
  consultStatus?: BRAND_CONSULT;

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
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  adminId?: number;
}
