import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { Faq } from '../faq.entity';

export class AdminFaqUpdateDto extends BaseDto<AdminFaqUpdateDto>
  implements Partial<Faq> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  faq?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  answer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: number;
}
