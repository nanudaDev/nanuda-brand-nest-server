import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { BaseDto } from 'src/core';
import { CommonCode } from '../common-code.entity';

export class AdminCommonCodeUpdateDto extends BaseDto<AdminCommonCodeUpdateDto>
  implements Partial<CommonCode> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Min(1)
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  comment?: string;
}
