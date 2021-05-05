import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadPresignedDto } from './dto';
import { FileUploadService } from './file-upload.service';

@Controller()
@ApiTags('FILE UPLOAD')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get('/file-upload/get-buckets')
  async getBuckets() {
    return await this.fileUploadService.getBuckets();
  }

  /**
   * switch CORS
   * @param bucketname
   * @returns
   */
  @Get('/switch-put-cors')
  switchCors() {
    return this.fileUploadService.putBucketCORS();
  }

  /**
   * get presigned urls for s3 upload
   * @param {FileUploadPresignedDto} presignedDto
   */
  @ApiOperation({ summary: 'S3 Upload presigned URL' })
  @Post('/file-upload/retrieve-s3-presigned')
  getPresignedUrl(@Body() presignedDto: FileUploadPresignedDto) {
    return this.fileUploadService.getS3TempUploadSignedUrl(presignedDto);
  }
}
