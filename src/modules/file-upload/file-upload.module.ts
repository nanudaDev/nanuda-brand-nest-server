import { Module } from '@nestjs/common';
import { PickcookUploadConfigService } from 'src/config';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService, PickcookUploadConfigService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
