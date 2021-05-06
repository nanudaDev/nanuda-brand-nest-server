import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { SERVICE_STATUS, SITE_IN_CONSTRUCTION } from 'src/shared';
import { SiteInServiceRecord } from '../site-in-service-record.entity';

export class GlobalSiteConstructionCreateDto
  extends BaseDto<GlobalSiteConstructionCreateDto>
  implements Partial<SiteInServiceRecord> {
  @ApiProperty({ enum: SITE_IN_CONSTRUCTION })
  @IsNotEmpty()
  @IsEnum(SITE_IN_CONSTRUCTION)
  @Default(SITE_IN_CONSTRUCTION.SERVICE_UPDATE)
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
  @Default(YN.YES)
  readyToRun?: YN;

  @ApiProperty({ enum: SERVICE_STATUS })
  @IsNotEmpty()
  @IsEnum(SERVICE_STATUS)
  @Expose()
  @Default(SERVICE_STATUS.ONGOING)
  status: SERVICE_STATUS;
}
