import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../../core';
import { PICKCOOK_UPLOAD_TYPE } from '../../../config';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FileAttachmentDto extends BaseDto<FileAttachmentDto> {
  constructor(partial?: Partial<FileAttachmentDto>) {
    super(partial);
  }

  @ApiProperty()
  @IsEnum(PICKCOOK_UPLOAD_TYPE)
  @Expose()
  uploadType: PICKCOOK_UPLOAD_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  originFilename: string;

  @ApiPropertyOptional()
  @Expose()
  source?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  key: string;

  @ApiPropertyOptional()
  @Expose()
  endpoint?: string;

  @ApiPropertyOptional()
  @Expose()
  mimetype?: string;
}
