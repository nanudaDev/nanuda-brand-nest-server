import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  arrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Default } from 'src/common';
import { BaseDto } from 'src/core';
import {
  AGE_GROUP,
  DELIVERY_OR_RESTAURANT,
  FNB_OWNER,
  KB_MEDIUM_CATEGORY,
  OPERATION_TIME,
  REVENUE_RANGE,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';
import { AggregateResultResponse } from '../aggregate-result-response.entity';

export class QuestionGivenArrayClass extends BaseDto<QuestionGivenArrayClass> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  questionId: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  givenId: number[];
}

export class AggregateResultResponseQueryDto
  extends BaseDto<AggregateResultResponseQueryDto>
  implements Partial<AggregateResultResponse> {
  // @ApiProperty({ enum: DELIVERY_OR_RESTAURANT })
  // @IsNotEmpty()
  // @Expose()
  // @IsEnum(DELIVERY_OR_RESTAURANT)
  // deliveryRatioCode: DELIVERY_OR_RESTAURANT;

  @ApiProperty({ enum: OPERATION_TIME, type: [OPERATION_TIME] })
  @IsArray()
  @Expose()
  operationTimes?: OPERATION_TIME[];

  @ApiProperty({ enum: AGE_GROUP })
  @IsNotEmpty()
  @Expose()
  @IsEnum(AGE_GROUP)
  ageGroupCode: AGE_GROUP;

  @ApiPropertyOptional({ enum: REVENUE_RANGE })
  @IsOptional()
  @Expose()
  @IsEnum(REVENUE_RANGE)
  @Default(null)
  revenueRangeCode?: REVENUE_RANGE;

  @ApiPropertyOptional({ enum: TENTATIVE_OPEN_OPTION })
  @IsOptional()
  @Expose()
  @IsEnum(TENTATIVE_OPEN_OPTION)
  @Default(null)
  isReadyCode?: TENTATIVE_OPEN_OPTION;

  @ApiProperty({ enum: FNB_OWNER })
  @IsOptional()
  @IsEnum(FNB_OWNER)
  @Expose()
  fnbOwnerStatus: FNB_OWNER;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @Default('1168051000')
  hdongCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hdongName?: string;

  @ApiPropertyOptional({ enum: KB_MEDIUM_CATEGORY })
  @IsOptional()
  @Expose()
  @Default(KB_MEDIUM_CATEGORY.F01)
  kbFoodCategory?: KB_MEDIUM_CATEGORY;

  @ApiProperty({ type: [QuestionGivenArrayClass] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionGivenArrayClass)
  @Expose()
  questionGivenArray: QuestionGivenArrayClass[];

  // @ApiProperty()
  // @IsNotEmpty()
  // @MinLength(2)
  // @Expose()
  // name: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsPhoneNumber('KR')
  // @Expose()
  // phone: string;
}
