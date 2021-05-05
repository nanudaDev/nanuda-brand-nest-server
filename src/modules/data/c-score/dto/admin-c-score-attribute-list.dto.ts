import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto } from 'src/core';
import { CScoreAttribute } from '../../entities';

export class AdminCScoreAttributeListDto
  extends BaseDto<AdminCScoreAttributeListDto>
  implements Partial<CScoreAttribute> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  highestInitialCostScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  highestMenuScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  highestManagingScore?: number;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  inUse?: YN;
}
