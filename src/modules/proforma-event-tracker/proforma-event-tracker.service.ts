import { Injectable } from '@nestjs/common';
import { ProformaEventTracker } from './proforma-event-tracker.entity';
import { BaseService } from '../../core/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { BrandAiException } from '../../core/errors/brand-ai.exception';

@Injectable()
export class ProformaEventTrackerService extends BaseService {
  constructor(
    @InjectRepository(ProformaEventTracker)
    private readonly proformaEventTrackerRepo: Repository<ProformaEventTracker>,
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
    if (!proforma.ipAddress) {
      throw new BrandAiException('proforma.noIpAddress');
    }
    let newRecord = new ProformaEventTracker();

    return newRecord;
  }
}
