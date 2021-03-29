import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEAN, IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { BRAND_CONSULT } from 'src/shared';
import { ConsultResult } from '../consult-result.entity';

export class AdminConsultResultUpdateDto
  extends BaseDto<AdminConsultResultUpdateDto>
  implements Partial<ConsultResult> {
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
}
