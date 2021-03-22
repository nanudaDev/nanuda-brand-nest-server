import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { Question } from '../question.entity';

export class AdminQuestionListeDto extends BaseDto<AdminQuestionListeDto>
  implements Partial<Question> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  question?: string;

  @ApiPropertyOptional({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @Expose()
  @IsEnum(FNB_OWNER)
  @IsOptional()
  userType?: FNB_OWNER;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @IsOptional()
  isLastQuestion: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @Expose()
  @IsOptional()
  inUse?: YN;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE)
  @Expose()
  @Default(ORDER_BY_VALUE.DESC)
  @IsOptional()
  orderById?: ORDER_BY_VALUE;
}
