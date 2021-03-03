import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/core';
import { Faq } from '../faq.entity';

export class FaqCreateDto extends BaseDto<FaqCreateDto>
  implements Partial<Faq> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  faq: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  answer: string;
}
