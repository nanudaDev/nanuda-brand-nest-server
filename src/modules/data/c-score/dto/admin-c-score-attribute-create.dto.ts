import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { CScoreAttribute } from '../../entities';

export class AdminCScoreAttributeCreateDto
  extends BaseDto<AdminCScoreAttributeCreateDto>
  implements Partial<CScoreAttribute> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  highestInitialCostScore: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  highestManagingScore: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  highestMenuScore: number;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  inUse?: YN;
}
