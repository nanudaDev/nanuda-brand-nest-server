import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Default } from 'src/common';

export class LocationAnalysisDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  hdongCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(null)
  mediumCategoryCode?: string;
}
