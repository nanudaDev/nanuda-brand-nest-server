import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min, MinLength } from 'class-validator';
import { BaseDto } from 'src/core';
import { COMMON_CODE_CATEGORY } from 'src/shared';
import { CommonCode } from '../common-code.entity';

export class AdminCommonCodeCreateDto extends BaseDto<AdminCommonCodeCreateDto>
  implements Partial<CommonCode> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(1)
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(1)
  value: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(1)
  category: string | COMMON_CODE_CATEGORY;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  comment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  id?: number;
}
