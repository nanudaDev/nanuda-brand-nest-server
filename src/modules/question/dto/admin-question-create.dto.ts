import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { QuestionGivenClass } from 'src/modules/question-given/question-given.class';
import { QuestionGiven } from 'src/modules/question-given/question-given.entity';
import { FNB_OWNER } from 'src/shared';
import { Question } from '../question.entity';

export class AdminQuestionCreateDto extends BaseDto<AdminQuestionCreateDto>
  implements Partial<Question> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  question: string;

  @ApiProperty({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @IsNotEmpty()
  @Expose()
  userType: FNB_OWNER;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  order: number;

  @ApiProperty({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  @IsNotEmpty()
  isLastQuestion: YN;

  @ApiProperty({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @Default(YN.YES)
  @IsNotEmpty()
  inUse: YN;

  @ApiProperty({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @Default(YN.NO)
  @IsNotEmpty()
  multipleAnswerYn: YN;

  @ApiPropertyOptional({ type: [QuestionGivenClass] })
  @ValidateNested()
  @Type(() => QuestionGivenClass)
  @IsOptional()
  @Expose()
  providedGivens?: QuestionGivenClass[];
}
