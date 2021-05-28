import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { BaseDto } from '../../../core/base.dto';
import { ConsultResultV3 } from '../consult-result-v3.entity';
import { FNB_OWNER } from '../../../shared/common-code.type';
export class AdminConsultResultV3CreateDto
  extends BaseDto<AdminConsultResultV3CreateDto>
  implements Partial<ConsultResultV3> {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: FNB_OWNER })
  @Expose()
  @IsEnum(FNB_OWNER)
  @IsNotEmpty()
  fnbOwnerStatus: FNB_OWNER;

  @ApiProperty()
  @IsPhoneNumber('KR', { message: '올바른 전화번호를 입력해주세요' })
  @IsNotEmpty()
  @Expose()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  proformaConsultResultId: number;
}
