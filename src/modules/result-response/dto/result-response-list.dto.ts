import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { ResultResponse } from '../result-response.entity';

export class ResultResponseListDto extends BaseDto<ResultResponseListDto>
  implements Partial<ResultResponse> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  responseCode: string;

  @ApiProperty({ enum: FNB_OWNER })
  @IsEnum(FNB_OWNER)
  @IsNotEmpty()
  @Expose()
  fnbOwnerStatus: FNB_OWNER;
}
