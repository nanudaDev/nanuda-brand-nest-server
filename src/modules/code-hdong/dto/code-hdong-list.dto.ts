import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { CodeHdong } from '../code-hdong.entity';

export class CodeHdongListDto extends BaseDto<CodeHdongListDto>
  implements Partial<CodeHdong> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sidoName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  guName?: string;
}
