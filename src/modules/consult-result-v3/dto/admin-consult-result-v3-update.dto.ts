import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../../core/base.dto';
import { ConsultResultV3 } from '../consult-result-v3.entity';
import { FNB_OWNER, BRAND_CONSULT } from '../../../shared/common-code.type';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
export class AdminConsultResultV3UpdateDto
  extends BaseDto<AdminConsultResultV3UpdateDto>
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

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  meetingDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  meetingTime?: string;
}
