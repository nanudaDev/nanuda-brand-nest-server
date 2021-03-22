import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto } from 'src/core';
import { Faq } from '../faq.entity';

export class FaqAnswerListDto extends BaseDto<FaqAnswerListDto>
  implements Partial<Faq> {
  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsOptional()
  @Expose()
  @Default(ORDER_BY_VALUE.ASC)
  @IsEnum(ORDER_BY_VALUE)
  orderByOrder?: ORDER_BY_VALUE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  faqParentId?: number;
}
