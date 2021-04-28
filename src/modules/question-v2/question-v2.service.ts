import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { QuestionV2 } from './question-v2.entity';

@Injectable()
export class QuestionV2Service extends BaseService {
  constructor(
    @InjectRepository(QuestionV2)
    private readonly questionV2Repo: Repository<QuestionV2>,
  ) {
    super();
  }
}
