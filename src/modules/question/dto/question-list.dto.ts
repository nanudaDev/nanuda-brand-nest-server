import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { Question } from '../question.entity';
// querydto 결과는  배열로 떨어지지 않고 getOne일 경우에 네이밍 사용한다
export class QuestionQueryDto extends BaseDto<QuestionQueryDto>
  implements Partial<Question> {
  @ApiProperty({ enum: FNB_OWNER })
  @IsNotEmpty()
  @IsEnum(FNB_OWNER)
  @Expose()
  userType: FNB_OWNER;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  order: number;

  @ApiPropertyOptional({ enum: YN })
  @Expose()
  @IsEnum(YN)
  @Default(YN.YES)
  inUse: YN;
}
