import { BaseDto } from '../../../core/base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { ConsultBaeminReport } from '../consult-baemin-report.entity';
import { KB_MEDIUM_CATEGORY } from 'src/shared';
import { BAEMIN_CATEGORY_CODE } from 'src/common';
export class AdminConsultBaeminReportUpdateDto
  extends BaseDto<AdminConsultBaeminReportUpdateDto>
  implements Partial<ConsultBaeminReport> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  averageScore: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  averageDeliveryTip: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  averageLikeRate: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  averageMonthlyOrderRate: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  minimumOrderPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  averageOrderRate: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongCode: string | number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  mediumCategoryCode: KB_MEDIUM_CATEGORY | string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  baeminCategoryCode: BAEMIN_CATEGORY_CODE | string;
}
