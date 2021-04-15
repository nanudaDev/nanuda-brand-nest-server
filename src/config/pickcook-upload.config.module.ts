import { Module } from '@nestjs/common';
import { PickcookUploadConfigService } from './pickcook-upload.config.service';

@Module({
  imports: [],
  providers: [PickcookUploadConfigService],
  exports: [PickcookUploadConfigService],
})
export class PickcookUploadModule {}
