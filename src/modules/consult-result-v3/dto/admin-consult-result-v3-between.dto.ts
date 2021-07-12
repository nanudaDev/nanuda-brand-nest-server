import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';

export class AdminConsultResultV3BetweenDto extends BaseDto<
  AdminConsultResultV3BetweenDto
> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  startDate: string;
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  endDate: string;
}
