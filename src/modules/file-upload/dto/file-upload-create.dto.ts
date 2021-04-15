import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PICKCOOK_UPLOAD_TYPE } from 'src/config';
import { IsEnum } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Expose()
  file: any;
}

export class FileUploadBodyDto {
  @ApiProperty({ enum: PICKCOOK_UPLOAD_TYPE })
  @IsEnum(PICKCOOK_UPLOAD_TYPE)
  @Expose()
  uploadType: PICKCOOK_UPLOAD_TYPE;
}
