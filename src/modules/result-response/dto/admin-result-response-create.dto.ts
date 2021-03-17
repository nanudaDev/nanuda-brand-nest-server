import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Default } from 'src/common';
import { BaseDto } from 'src/core';
import {
  AGE_GROUP,
  EXP_GROUP,
  FNB_OWNER,
  HOW_SKILL,
  REVENUE_RANGE,
  SKILL_GROUP,
} from 'src/shared';
import { ResultResponse } from '../result-response.entity';

export class AdminResultResponseCreateDto
  extends BaseDto<AdminResultResponseCreateDto>
  implements Partial<ResultResponse> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  response: string;

  @ApiProperty({ enum: AGE_GROUP })
  @IsEnum(AGE_GROUP)
  @IsNotEmpty()
  @Expose()
  ageGroup: AGE_GROUP;

  @ApiProperty({ enum: REVENUE_RANGE })
  @IsEnum(REVENUE_RANGE)
  @Expose()
  @IsNotEmpty()
  revenueRange: REVENUE_RANGE;

  @ApiProperty({ enum: EXP_GROUP })
  @IsEnum(EXP_GROUP)
  @IsNotEmpty()
  @Expose()
  expGroup: EXP_GROUP;

  @ApiProperty({ enum: SKILL_GROUP })
  @IsEnum(SKILL_GROUP)
  @IsNotEmpty()
  @Expose()
  skillGroup: SKILL_GROUP;

  @ApiProperty({ enum: HOW_SKILL })
  @IsEnum(HOW_SKILL)
  @IsNotEmpty()
  @Expose()
  howSkillGroup: HOW_SKILL;

  @ApiProperty({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @Expose()
  @IsNotEmpty()
  fnbOwnerStatus: FNB_OWNER;
}
