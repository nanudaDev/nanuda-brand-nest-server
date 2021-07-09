import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { ConsultResultV3 } from '../consult-result-v3.entity';
import { FNB_OWNER, BRAND_CONSULT } from '../../../shared/common-code.type';
import { ORDER_BY_VALUE } from '../../../common/interfaces/order-by-value.type';
import { Default } from 'src/common';
export class AdminConsultResultV3ListDto
  extends BaseDto<AdminConsultResultV3ListDto>
  implements Partial<ConsultResultV3> {
  @ApiPropertyOptional({ enum: FNB_OWNER })
  @IsOptional()
  @Expose()
  @IsEnum(FNB_OWNER)
  fnbOwnerStatus?: FNB_OWNER;

  @ApiPropertyOptional({ enum: BRAND_CONSULT })
  @IsOptional()
  @Expose()
  @IsEnum(BRAND_CONSULT)
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
  meetingDate?: Date;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  orderById?: ORDER_BY_VALUE;
}
