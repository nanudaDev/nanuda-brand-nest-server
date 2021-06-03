import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { RandomConsultCountTracker } from '../random-consult-count-tracker.entity';
export class AdminRandomConsultCountTrackerUpdateDto
  extends BaseDto<AdminRandomConsultCountTrackerUpdateDto>
  implements Partial<RandomConsultCountTracker> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  value: number;
}
