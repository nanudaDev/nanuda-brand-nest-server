import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from '../../../../core/base.dto';
import { PickcookSales } from '../../entities/pickcook-sales.entity';
import { KB_MEDIUM_CATEGORY } from '../../../../shared/common-code.type';
import { PICKCOOK_SALES_TYPE } from 'src/common';
// find hdong with medium category code
export class AdminPickcookSalesQueryDto
  extends BaseDto<AdminPickcookSalesQueryDto>
  implements Partial<PickcookSales> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  hdongCode: number;

  @ApiProperty({ enum: KB_MEDIUM_CATEGORY })
  @Expose()
  @IsEnum(KB_MEDIUM_CATEGORY)
  @IsNotEmpty()
  mediumCategoryCode: KB_MEDIUM_CATEGORY;

  @ApiPropertyOptional({ enum: PICKCOOK_SALES_TYPE })
  @IsOptional()
  @Expose()
  @IsEnum(PICKCOOK_SALES_TYPE)
  storeType?: PICKCOOK_SALES_TYPE;
}

// 1171063100
