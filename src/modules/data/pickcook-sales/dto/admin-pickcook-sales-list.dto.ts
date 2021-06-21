import { AdminPickcookSalesQueryDto } from './admin-pickcook-sales-query.dto';
import { BaseDto } from '../../../../core/base.dto';
import { PickcookSales } from '../../entities';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { KB_MEDIUM_CATEGORY } from '../../../../shared/common-code.type';
import { PICKCOOK_SALES_GU_DONG } from '../../../../common/interfaces/pickcook-sales-gu-dong-type.type';
import { ORDER_BY_VALUE } from '../../../../common/interfaces/order-by-value.type';
import { PICKCOOK_SALES_TYPE } from 'src/common';
export class AdminPickcookSalesListDto
  extends BaseDto<AdminPickcookSalesListDto>
  implements Partial<PickcookSales> {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  hdongCode?: number;

  @ApiPropertyOptional({ enum: KB_MEDIUM_CATEGORY })
  @IsOptional()
  @IsEnum(KB_MEDIUM_CATEGORY)
  @Expose()
  mediumCategoryCode?: KB_MEDIUM_CATEGORY;

  @ApiPropertyOptional({ enum: PICKCOOK_SALES_GU_DONG })
  @IsOptional()
  @Expose()
  @IsEnum(PICKCOOK_SALES_GU_DONG)
  guDongType?: PICKCOOK_SALES_GU_DONG;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediumCategoryName?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @IsEnum(ORDER_BY_VALUE)
  orderById?: ORDER_BY_VALUE;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  minSedeCount?: number;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  maxSedeCount?: number;

  @ApiPropertyOptional({ enum: PICKCOOK_SALES_TYPE })
  @IsOptional()
  @Expose()
  @IsEnum(PICKCOOK_SALES_TYPE)
  storeType?: PICKCOOK_SALES_TYPE;
}
