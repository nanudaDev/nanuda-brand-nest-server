import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { BaseDto } from 'src/core';
import { CommonCode } from '../common-code.entity';

export class AdminCommonCodeCreateDto extends BaseDto<AdminCommonCodeCreateDto>
  implements Partial<CommonCode> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Min(1)
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Min(1)
  value: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Min(1)
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  comment?: string;
}
