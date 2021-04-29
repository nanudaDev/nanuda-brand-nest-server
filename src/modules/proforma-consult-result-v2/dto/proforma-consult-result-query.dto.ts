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
import { QuestionGivenArrayClass } from 'src/modules/aggregate-result-response/dto';
import {
  AGE_GROUP,
  DELIVERY_OR_RESTAURANT,
  FNB_OWNER,
  KB_MEDIUM_CATEGORY,
  OPERATION_TIME,
  REVENUE_RANGE,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2.entity';

export class ProformaConsultResultV2QueryDto
  extends BaseDto<ProformaConsultResultV2QueryDto>
  implements Partial<ProformaConsultResultV2> {
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
  //   @Default(KB_MEDIUM_CATEGORY.F01)
  selectedKbMediumCategory?: KB_MEDIUM_CATEGORY;

  @ApiProperty({ type: [QuestionGivenArrayClass] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionGivenArrayClass)
  @Expose()
  questionGivenArray: QuestionGivenArrayClass[];
}
