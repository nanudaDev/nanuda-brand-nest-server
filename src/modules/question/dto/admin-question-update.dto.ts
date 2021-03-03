import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { Question } from '../question.entity';

export class AdminQuestionUpdateDto extends BaseDto<AdminQuestionUpdateDto>
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
}
