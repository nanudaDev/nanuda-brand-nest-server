import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { BaseDto } from 'src/core';
import { FaqAnswerCreateClass } from '../faq-answer-create.class';
import { Faq } from '../faq.model';

export class AdminFaqCreateDto extends BaseDto<AdminFaqCreateDto>
  implements Partial<Faq> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  faq: string;

  @ApiPropertyOptional({ type: [FaqAnswerCreateClass] })
  @Type(() => FaqAnswerCreateClass)
  @Expose()
  @IsOptional()
  @ValidateNested()
  providedAnswers?: FaqAnswerCreateClass[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: number;
}
