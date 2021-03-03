import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LocationAnalysisDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  hdongCode: string;
}
