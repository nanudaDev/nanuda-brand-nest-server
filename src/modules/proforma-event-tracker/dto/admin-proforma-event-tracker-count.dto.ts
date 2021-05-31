import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { FNB_OWNER } from '../../../shared/common-code.type';
export class AdminProformaEventTrackerCountDto extends BaseDto<
  AdminProformaEventTrackerCountDto
> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @Expose()
  ended?: Date;

  @ApiPropertyOptional({ enum: FNB_OWNER })
  @Expose()
  @IsOptional()
  @IsEnum(FNB_OWNER)
  fnbOwnerStatus?: FNB_OWNER;
}
