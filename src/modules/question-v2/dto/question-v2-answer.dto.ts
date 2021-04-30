import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsIP, IsNotEmpty } from 'class-validator';
import { Default } from 'src/common';
import { BaseDto } from 'src/core';
import { QuestionV2Tracker } from 'src/modules/question-tracker-v2/question-tracker-v2.entity';
import { FNB_OWNER } from 'src/shared';

export class QuestionV2AnsweredDto extends BaseDto<QuestionV2AnsweredDto>
  implements Partial<QuestionV2Tracker> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  questionId: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  givenId: number[];

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsIP(null, { message: 'Not a valid IP address' })
  @Default('112.169.101.10')
  ipAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  uniqueSessionId: string;

  @ApiProperty({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @IsNotEmpty()
  @Expose()
  userType: FNB_OWNER;
}
