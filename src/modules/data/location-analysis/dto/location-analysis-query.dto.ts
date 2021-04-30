import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Default } from 'src/common';

export class LocationAnalysisDto {
  @ApiProperty()
  @IsNotEmpty({ message: '행정동을 전송해주세요.' })
  @Expose()
  hdongCode: string | number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(null)
  mediumCategoryCode?: string;
}
