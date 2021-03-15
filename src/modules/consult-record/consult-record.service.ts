import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';

@Injectable()
export class ConsultRecordService extends BaseService {
  constructor() {
    super();
  }
}
