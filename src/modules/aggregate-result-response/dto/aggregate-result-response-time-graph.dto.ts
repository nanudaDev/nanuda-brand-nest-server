import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { KbOfflineSpacePurchaseRecord } from 'src/modules/data/entities/kb-offline-space-purchase-record.entity';
import { KB_FOOD_CATEGORY, KB_MEDIUM_CATEGORY } from 'src/shared';

export class AggregateResultResponseTimeGraphDto
  extends BaseDto<AggregateResultResponseTimeGraphDto>
  implements Partial<KbOfflineSpacePurchaseRecord> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  hdongCode: number;

  @ApiProperty({ enum: KB_MEDIUM_CATEGORY })
  @IsEnum(KB_MEDIUM_CATEGORY)
  @Expose()
  @IsNotEmpty()
  mediumCategoryCd: KB_MEDIUM_CATEGORY;
}
