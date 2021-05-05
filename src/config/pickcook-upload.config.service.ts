require('dotenv').config();
export enum PICKCOOK_UPLOAD_TYPE {
  LOCATION_ANALYSIS = 'location-analysis',
  RESOURCE = 'resource',
  POPUP = 'popup',
}

export enum ACL {
  PUBLIC = 'public-read',
  PRIVATE = 'private',
}

type S3BucketInfo = {
  bucketName: string;
  cloudFrontUrl?: string;
};
type S3BucketInfoEnvironments = {
  [key in 'production' | 'staging']: S3BucketInfo;
};

type UploadOption = {
  path: string;
  sizeLimit: number;
  fileType: FileType;
  // imageSizeArray?: [[number, number], [number, number]?];
  // resized?: boolean;
  // squared?: boolean;
  // cropped?: boolean;
};
type UploadOptionConfig = {
  [key in PICKCOOK_UPLOAD_TYPE]: UploadOption;
};
type MimeTypes = {
  [key in FileType]: string[];
};
export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class PickcookUploadConfigService {
  public readonly bucketEndpoint = process.env.NAVER_CLOUD_S3_URL;
  public readonly bucketInfo: S3BucketInfo;

  public pickcookBucketInfoEnvironments: S3BucketInfoEnvironments = {
    production: {
      bucketName: 'production-storage-pickcook',
      cloudFrontUrl: null, // 네이버 클라우드 클라우드 프런트 검색 후
    },
    staging: {
      bucketName: 'staging-storage-pickcook',
      cloudFrontUrl: null,
    },
  };

  public readonly bucketTypes: UploadOptionConfig = {
    [PICKCOOK_UPLOAD_TYPE.LOCATION_ANALYSIS]: {
      path: 'location-analysis',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [PICKCOOK_UPLOAD_TYPE.RESOURCE]: {
      path: 'resource',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [PICKCOOK_UPLOAD_TYPE.POPUP]: {
      path: 'popup',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
  };

  // 업로드 허용 확장자 정보
  public readonly mimeTypes: MimeTypes;

  constructor() {
    this.bucketInfo = this.pickcookBucketInfoEnvironments[process.env.NODE_ENV];
    this.mimeTypes = {
      // 업로드 허용 확장자 설정 (이미지 타입)
      [FileType.IMAGE]: ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'],
      // 업로드 허용 확장자 설정 (문서 타입)
      [FileType.DOCUMENT]: [
        'image/gif',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/heic',
        'application/octet-stream',
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/pdf', // .pdf
        'application/zip', // .zip
        'text/csv', // .csv
        'text/plain', // .txt],
      ],
    };
  }

  public getMimeTypes(fileType: FileType): string[] {
    return this.mimeTypes[fileType];
  }
}

export const pickcookBucketInfoEnvironments: S3BucketInfoEnvironments = {
  production: {
    bucketName: 'production-storage-pickcook',
    cloudFrontUrl: null, // 네이버 클라우드 클라우드 프런트 검색 후
  },
  staging: {
    bucketName: 'staging-storage-pickcook',
    cloudFrontUrl: null,
  },
};
