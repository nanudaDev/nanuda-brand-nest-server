import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { SITE_IN_CONSTRUCTION, SERVICE_STATUS } from 'src/shared';
import { SiteInServiceRecord } from '../site-in-service-record.entity';

export class GlobalSiteConstructionUpdateDto
  extends BaseDto<GlobalSiteConstructionUpdateDto>
  implements Partial<SiteInServiceRecord> {
  @ApiPropertyOptional({ enum: SITE_IN_CONSTRUCTION })
  @IsOptional()
  @IsEnum(SITE_IN_CONSTRUCTION)
  @Expose()
  serviceUpgradeReason: SITE_IN_CONSTRUCTION;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  readyToRun?: YN;

  @ApiPropertyOptional({ enum: SERVICE_STATUS })
  @IsOptional()
  @IsEnum(SERVICE_STATUS)
  @Expose()
  status: SERVICE_STATUS;
}
