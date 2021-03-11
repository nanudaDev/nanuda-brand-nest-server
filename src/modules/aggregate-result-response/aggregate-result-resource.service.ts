import { Injectable } from '@nestjs/common';
import { CompressionTypes } from '@nestjs/common/interfaces/external/kafka-options.interface';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { AggregateResultResponseBackup } from './aggregate-result-response-backup.entity';
import { AggregateResultResponse } from './aggregate-result-response.entity';

@Injectable()
export class AggregateResultResponseService extends BaseService {
  constructor(
    @InjectRepository(AggregateResultResponse)
    private readonly responseRepo: Repository<AggregateResultResponse>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  async findResponseForQuestions() {}

  /**
   * transfer data
   */
  async transferData() {
    const transfer = await this.entityManager.transaction(
      async entityManager => {
        const qb = await this.entityManager
          .getRepository(AggregateResultResponseBackup)
          .createQueryBuilder('backup')
          .getMany();
        await Promise.all(
          qb.map(async q => {
            let newResponse = new AggregateResultResponse().set(q);
            newResponse.response = newResponse.response.replace(
              '"중분류"',
              'MEDIUM_CODE',
            );
            newResponse.response = newResponse.response.replace(
              '"소분류"',
              'SMALL_CODE',
            );
            const qb = await this.responseRepo
              .createQueryBuilder('response')
              .getMany();
            if (qb && qb.length < 1) {
              newResponse = await entityManager.save(newResponse);
            }
          }),
        );
      },
    );
  }
}
