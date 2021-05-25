import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../../core/base.dto';
import { ConsultResultV3 } from '../consult-result-v3.entity';
import { FNB_OWNER, BRAND_CONSULT } from '../../../shared/common-code.type';
import { IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
export class ConsultResultV3UpdateDto extends BaseDto<ConsultResultV3UpdateDto>
  implements Partial<ConsultResultV3> {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: BRAND_CONSULT })
  @IsOptional()
  @Expose()
  @IsEnum(BRAND_CONSULT)
  consultStatus?: BRAND_CONSULT;
}
