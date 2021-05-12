import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsEnum } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2.entity';
import { ORDER_BY_VALUE } from '../../../common/interfaces/order-by-value.type';
import {
  FNB_OWNER,
  KB_MEDIUM_CATEGORY,
} from '../../../shared/common-code.type';
import { Default } from 'src/common';
import { YN } from '../../../common/interfaces/yn.type';
export class AdminProformaConsultResultV2ListDto
  extends BaseDto<AdminProformaConsultResultV2ListDto>
  implements Partial<ProformaConsultResultV2> {
  @ApiPropertyOptional({ enum: FNB_OWNER })
  @IsOptional()
  @Expose()
  @IsEnum(FNB_OWNER)
  fnbOwnerStatus?: FNB_OWNER;

  @ApiPropertyOptional({ enum: KB_MEDIUM_CATEGORY })
  @IsOptional()
  @Expose()
  @IsEnum(KB_MEDIUM_CATEGORY)
  selectedKbMediumCategory?: KB_MEDIUM_CATEGORY;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsEnum(ORDER_BY_VALUE)
  orderById?: ORDER_BY_VALUE;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Expose()
  isConsultYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongCode?: string | number;
}
