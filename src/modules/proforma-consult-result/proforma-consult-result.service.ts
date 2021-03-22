import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { ProformaConsultResult } from './proforma-consult-result.entity';

@Injectable()
export class ProformaConsultResultService extends BaseService {
  constructor(
    @InjectRepository(ProformaConsultResult)
    private readonly proformaConsultRepo: Repository<ProformaConsultResult>,
  ) {
    super();
  }

  /**
   * find one
   * @param id
   */
  async findOne(id: number): Promise<ProformaConsultResult> {
    const proforma = await this.proformaConsultRepo
      .createQueryBuilder('proformaConsult')
      .CustomInnerJoinAndSelect([
        'fnbOwnerCodeStatus',
        'revenueRangeCodeStatus',
        'ageGroupCodeStatus',
      ])
      .where('proformaConsult.id = :id', { id: id })
      .getOne();

    return proforma;
  }
}
