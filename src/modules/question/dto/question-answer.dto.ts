import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEAN, IsEnum, IsIP, IsNotEmpty } from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { QuestionTracker } from 'src/modules/question-tracker/question-tracker.entity';
import { FNB_OWNER } from 'src/shared';

export class QuestionAnsweredDto extends BaseDto<QuestionAnsweredDto>
  implements Partial<QuestionTracker> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  questionId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  givenId: number;

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
