import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { QuestionGiven } from './question-given.entity';

export class QuestionGivenClass implements Partial<QuestionGiven> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  given: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  value: string;
}
