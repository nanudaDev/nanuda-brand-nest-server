import { AdminPickcookSalesQueryDto } from './admin-pickcook-sales-query.dto';
import { BaseDto } from '../../../../core/base.dto';
import { PickcookSales } from '../../entities';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { KB_MEDIUM_CATEGORY } from '../../../../shared/common-code.type';
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
}
