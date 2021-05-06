require('dotenv').config();
import * as AWS from 'aws-sdk';
import * as uuidv4 from 'uuid/v4';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  ACL,
  ENVIRONMENT,
  pickcookBucketInfoEnvironments,
  PickcookUploadConfigService,
} from 'src/config';
import moment from 'moment';
import { extname } from 'path';
import { FileAttachmentDto, FileUploadPresignedDto } from './dto';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;
  constructor(
    private readonly pickcookUploadConfigService: PickcookUploadConfigService,
  ) {
    const configOptions = {
      accessKeyId: process.env.NAVER_CLOUD_S3_KEY,
      secretAccessKey: process.env.NAVER_CLOUD_S3_SECRET_KEY,
      bucketEndpoint: this.pickcookUploadConfigService.bucketEndpoint,
      region: process.env.NAVER_CLOUD_S3_REGION,
      signatureVersion: 'v4',
    };
    AWS.config.update(configOptions);

    this.s3 = new AWS.S3({
      endpoint: new AWS.Endpoint(
        this.pickcookUploadConfigService.bucketEndpoint,
      ).href,
      useAccelerateEndpoint: false,
    });
  }

  async getBuckets() {
    const { Buckets } = await this.s3.listBuckets().promise();
    for (const bucket of Buckets) {
      console.log(bucket);
    }
    return Buckets;
  }

  /**
   * Generate S3 upload signed url
   *
   * 참고)
   * https://medium.com/@aakashbanerjee/upload-files-to-amazon-s3-from-the-browser-using-pre-signed-urls-4602a9a90eb5
   * @param {UPLOAD_TYPE} uploadType
   * @param {string} filename
   */
  async getS3TempUploadSignedUrl(
    presignedDto: FileUploadPresignedDto,
  ): Promise<{ url: string; source: string; key: string }> {
    const uploadOption = this.pickcookUploadConfigService.bucketTypes[
      presignedDto.uploadType
    ];
    if (!uploadOption) throw new NotFoundException();
    if (
      !this.pickcookUploadConfigService
        .getMimeTypes(uploadOption.fileType)
        .includes(presignedDto.mimetype)
    )
      throw new BadRequestException({
        message: 'Unsupported MIME TYPE',
      });

    const key = `${presignedDto.uploadType}/${moment().format(
      'YYYY-MM-DD',
    )}/${uuidv4()}${extname(presignedDto.filename).toLowerCase()}`;
    // 이미 폴더 경로
    const source = `tmp/${key}`;
    const params = {
      // Bucket: this.uploadConfig.bucketInfo.bucketName,
      Bucket:
        process.env.NODE_ENV === ENVIRONMENT.PRODUCTION
          ? pickcookBucketInfoEnvironments.production.bucketName
          : pickcookBucketInfoEnvironments.staging.bucketName,
      Key: source,
      ContentType: presignedDto.mimetype,
      // Metadata: {}, // 메타 데이터 정책 정하고 삽입
      Expires: 60 * 60, // signed url expire seconds
    };
    return {
      // AWS.S3에 포한된 getSignedUrlPromise 사용
      url: await this.s3.getSignedUrlPromise('putObject', params),
      source,
      key,
    };
  }

  /**
   * move s3 file
   * @param attachments
   */
  async moveS3File(
    attachments: FileAttachmentDto[],
  ): Promise<FileAttachmentDto[]> {
    try {
      const bucketUrl = this.pickcookUploadConfigService.bucketEndpoint;
      if (!attachments || attachments.length === 0) return [];
      return await Promise.all(
        attachments.map(async attachment => {
          const uploadOptionConfig = this.pickcookUploadConfigService
            .bucketTypes[attachment.uploadType];
          if (!uploadOptionConfig) return null;
          const bucketName =
            process.env.NODE_ENV === ENVIRONMENT.PRODUCTION
              ? pickcookBucketInfoEnvironments.production.bucketName
              : pickcookBucketInfoEnvironments.staging.bucketName;
          const params = {
            Bucket:
              process.env.NODE_ENV === ENVIRONMENT.PRODUCTION
                ? pickcookBucketInfoEnvironments.production.bucketName
                : pickcookBucketInfoEnvironments.staging.bucketName,
            CopySource: `${bucketName}/${attachment.source}`,
            // 영규 소장 폴더 경로
            Key: `storage/${attachment.key}`,
            ACL: ACL.PUBLIC,
          };

          await this.s3.copyObject(params).promise();

          attachment.key = params.Key;
          attachment.endpoint = `${bucketUrl}/${bucketName}/${params.Key}`;
          delete attachment.source;
          return attachment;
        }),
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestException({
        message: `Upload failed. ${attachments[0].key}`,
      });
    }
  }

  // 버킷 CORS 변경 함수
  async putBucketCORS() {
    const bucketName =
      process.env.NODE_ENV === ENVIRONMENT.PRODUCTION
        ? pickcookBucketInfoEnvironments.production.bucketName
        : pickcookBucketInfoEnvironments.staging.bucketName;
    const params = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['PUT', 'POST', 'DELETE', 'GET'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['x-amz-server-side-encryption'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
      ContentMD5: '',
    };
    this.s3
      .putBucketCors(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          // 데이터 받으려면 AWS.Response sdk 사용해야함.
          console.log(data);
        }
      })
      .promise();
  }
}
