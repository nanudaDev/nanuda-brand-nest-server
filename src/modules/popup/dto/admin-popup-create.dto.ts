import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto } from 'src/core';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { PICKCOOK_POPUP } from 'src/shared';
import { Popup } from '../popup.entity';

export class AdminPopupCreateDto extends BaseDto<AdminPopupCreateDto>
  implements Partial<Popup> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  description: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Default(YN.NO)
  inUse?: YN;

  @ApiPropertyOptional({ enum: PICKCOOK_POPUP })
  @IsOptional()
  @Expose()
  @IsEnum(PICKCOOK_POPUP)
  @Default(PICKCOOK_POPUP.REG_SERVICE_UPDATE)
  popupType?: PICKCOOK_POPUP;

  @ApiPropertyOptional({ type: [FileAttachmentDto], isArray: true })
  @Type(() => FileAttachmentDto)
  @Expose()
  @ValidateNested({ each: true })
  @IsArray()
  images?: FileAttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  started?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  ended?: Date;
}
