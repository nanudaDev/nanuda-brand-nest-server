import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';

export class MonthlyRequestDto extends BaseDto<MonthlyRequestDto> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  year: number;
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  month: number;
}
