import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ORDER_BY_VALUE, YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { SERVICE_STATUS } from 'src/shared';
import { EntityManager, Repository } from 'typeorm';
import {
  GlobalSiteConstructionCreateDto,
  GlobalSiteConstructionUpdateDto,
} from './dto';
import { SiteInServiceRecordBackup } from './site-in-service-record-backup.entity';
import { SiteInServiceRecord } from './site-in-service-record.entity';

@Injectable()
export class GlobalService extends BaseService {
  constructor(
    @InjectRepository(SiteInServiceRecord)
    private readonly siteConstructionRepo: Repository<SiteInServiceRecord>,
    @InjectRepository(SiteInServiceRecordBackup)
    private readonly siteConstructionBackupRepo: Repository<
      SiteInServiceRecordBackup
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create new ticket
   * @param adminId
   * @param siteConstructionCreateDto
   * @returns
   */
  async create(
    adminId: number,
    siteConstructionCreateDto: GlobalSiteConstructionCreateDto,
  ): Promise<SiteInServiceRecord | SiteInServiceRecordBackup> {
    console.log(siteConstructionCreateDto);
    const record = new SiteInServiceRecord(siteConstructionCreateDto);
    record.adminId = adminId;
    // 완료 또는 보류
    if (siteConstructionCreateDto.status === SERVICE_STATUS.COMPLETE) {
      const backup = await this.entityManager.transaction(
        async entityManager => {
          const newBackup = new SiteInServiceRecordBackup(record);
          newBackup.ticketId = record.id;
          await entityManager.save(newBackup);
          //   await this.siteConstructionRepo
          //     .createQueryBuilder()
          //     .AndWhereHardDelete('SiteInService', 'id', record.id);
          return newBackup;
        },
      );
      return backup;
    }
    return await this.siteConstructionRepo.save(record);
  }

  async updateTicket(
    id: number,
    adminId: number,
    siteInConstructionUpdateDto: GlobalSiteConstructionUpdateDto,
  ): Promise<SiteInServiceRecord | SiteInServiceRecordBackup> {
    let record = await this.siteConstructionRepo.findOne(id);
    if (!id) throw new BrandAiException('global.notFound');
    if (record.adminId !== adminId) {
      record.adminId = adminId;
    }
    record = record.set(siteInConstructionUpdateDto);
    if (record.status === SERVICE_STATUS.COMPLETE || SERVICE_STATUS.ARCHIVED) {
      const backup = await this.entityManager.transaction(
        async entityManager => {
          console.log();
        },
      );
    }
    return await this.siteConstructionRepo.save(record);
  }

  /**
   * check if the site is available for release
   */
  async checkCurrentStatus() {
    const check = await this.siteConstructionRepo
      .createQueryBuilder('ticket')
      //   .where('ticket.readyToRun = :yn', { yn: YN.NO })
      .orderBy('ticket.id', ORDER_BY_VALUE.DESC)
      .getMany();

    if (check && check.length < 1) return true;
    else return false;
  }
}
