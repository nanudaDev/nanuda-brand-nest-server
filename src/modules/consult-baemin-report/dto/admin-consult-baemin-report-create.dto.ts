import { BaseDto } from '../../../core/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ConsultBaeminReport } from '../consult-baemin-report.entity';
import { KB_MEDIUM_CATEGORY } from '../../../shared/common-code.type';
export class AdminConsultBaeminReportCreateDto
  extends BaseDto<AdminConsultBaeminReportCreateDto>
  implements Partial<ConsultBaeminReport> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  averageScore: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  averageDeliveryTip: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  averageLikeRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  averageMonthlyOrderRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  minimumOrderPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  averageOrderRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  mediumCategoryCode: KB_MEDIUM_CATEGORY | string;
}
