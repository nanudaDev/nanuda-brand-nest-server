import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Faq } from './faq.model';

export class FaqAnswerCreateClass implements Partial<Faq> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  answer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: number;
}
