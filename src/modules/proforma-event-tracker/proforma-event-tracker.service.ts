import { Injectable } from '@nestjs/common';
import { ProformaEventTracker } from './proforma-event-tracker.entity';
import { BaseService } from '../../core/base.service';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { BrandAiException } from '../../core/errors/brand-ai.exception';
import { ORDER_BY_VALUE } from '../../common/interfaces/order-by-value.type';

@Injectable()
export class ProformaEventTrackerService extends BaseService {
  constructor(
    @InjectRepository(ProformaEventTracker)
    private readonly proformaEventTrackerRepo: Repository<ProformaEventTracker>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create new record
   * @param proforma
   * @returns
   */
  async createRecord(
    proforma: ProformaConsultResultV2,
  ): Promise<ProformaEventTracker> {
    let newRecord = new ProformaEventTracker();
    if (!proforma.ipAddress) {
      throw new BrandAiException('proforma.noIpAddress');
    }
    const checkIpAddress = await this.proformaEventTrackerRepo
      .createQueryBuilder('tracker')
      .where('tracker.ipAddress = :ipAddress', {
        ipAddress: proforma.ipAddress,
      })
      .orderBy('tracker.id', ORDER_BY_VALUE.DESC)
      .getOne();
    const checkTime = this.__check_if_over_thirty_minutes(checkIpAddress);
    if (!checkIpAddress) {
      newRecord.proformaConsultId = proforma.id;
      newRecord.ipAddress = proforma.ipAddress;
      newRecord = await this.proformaEventTrackerRepo.save(newRecord);
    }
    if (checkIpAddress && !checkTime) {
      newRecord.proformaConsultId = proforma.id;
      newRecord.ipAddress = proforma.ipAddress;
      newRecord = await this.proformaEventTrackerRepo.save(newRecord);
    } else if (checkIpAddress && checkTime) {
      // return nothing or do nothing
      return null;
    }

    return newRecord;
  }

  /**
   * check if over thirty minutes since last interaction
   * @param tracker
   * @returns
   */
  private __check_if_over_thirty_minutes(tracker: ProformaEventTracker) {
    const date = new Date();
    const halfAnHour = 1000 * 60 * 30;
    const trackerDate = tracker.created;
    const differenceInTime = date.getTime() - trackerDate.getTime();
    if (differenceInTime > halfAnHour) {
      return false;
    } else {
      return true;
    }
  }
}
