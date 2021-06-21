import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../../../core/base.dto';
import { PickcookSales } from '../../entities/pickcook-sales.entity';
import { KB_MEDIUM_CATEGORY } from '../../../../shared/common-code.type';
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
}
