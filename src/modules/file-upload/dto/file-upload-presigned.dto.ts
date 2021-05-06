import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../../core';
import { PICKCOOK_UPLOAD_TYPE } from '../../../config';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FileUploadPresignedDto extends BaseDto<FileUploadPresignedDto> {
  constructor(partial?: Partial<FileUploadPresignedDto>) {
    super(partial);
  }

  @ApiProperty({ enum: PICKCOOK_UPLOAD_TYPE })
  @IsEnum(PICKCOOK_UPLOAD_TYPE)
  @Expose()
  uploadType: PICKCOOK_UPLOAD_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  filename: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  mimetype: string;
}
