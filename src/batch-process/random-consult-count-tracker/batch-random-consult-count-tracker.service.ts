require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base.service';
import { RandomConsultCountTracker } from '../../modules/random-consult-count-tracker/random-consult-count-tracker.entity';
import { YN } from '../../common/interfaces/yn.type';
import { ORDER_BY_VALUE } from '../../common/interfaces/order-by-value.type';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ENVIRONMENT } from '../../config/environment.type';

@Injectable()
export class BatchRandomConsultCountTrackerService extends BaseService {
  constructor(
    @InjectRepository(RandomConsultCountTracker)
    private readonly randomConsultCountTrackerRepo: Repository<
      RandomConsultCountTracker
    >,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createNewTracker() {
    if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
      const tracker = await this.randomConsultCountTrackerRepo
        .createQueryBuilder('tracker')
        .where('tracker.isUsedYn = :isUsedYn', { isUsedYn: YN.YES })
        .orderBy('tracker.id', ORDER_BY_VALUE.DESC)
        .getOne();
      const newTracker = new RandomConsultCountTracker();
      newTracker.value = tracker.value + 100;
      newTracker.isUsedYn = YN.YES;
      tracker.isUsedYn = YN.NO;
      await this.randomConsultCountTrackerRepo.save(tracker);
      await this.randomConsultCountTrackerRepo.save(newTracker);
    }
  }
}
