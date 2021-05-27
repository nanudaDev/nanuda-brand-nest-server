import { Injectable, NotFoundException } from '@nestjs/common';
import { ProformaEventTracker } from './proforma-event-tracker.entity';
import { BaseService } from '../../core/base.service';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { BrandAiException } from '../../core/errors/brand-ai.exception';
import { ORDER_BY_VALUE } from '../../common/interfaces/order-by-value.type';
import { AdminProformaEventTrackerListDto } from './dto/admin-proforma-event-tracker-list.dto';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../common/interfaces/pagination.type';

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
   * find all for admin
   * @param adminProformaEventTrackerListDto
   * @param pagination
   * @returns
   */
  async findAllForAdmin(
    adminProformaEventTrackerListDto: AdminProformaEventTrackerListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProformaEventTracker>> {
    const qb = this.proformaEventTrackerRepo
      .createQueryBuilder('tracker')
      .CustomInnerJoinAndSelect(['proformaConsult'])
      .CustomLeftJoinAndSelect(['consult'])
      .AndWhereLike(
        'proforma',
        'fnbOwnerStatus',
        adminProformaEventTrackerListDto.proformaFnbOwnerStatus,
        adminProformaEventTrackerListDto.exclude('proformaFnbOwnerStatus'),
      )
      .AndWhereLike(
        'proforma',
        'selectedKbMediumCategory',
        adminProformaEventTrackerListDto.selectedKbMediumCategory,
        adminProformaEventTrackerListDto.exclude('selectedKbMediumCategory'),
      )
      .AndWhereLike(
        'consult',
        'fnbOwnerStatus',
        adminProformaEventTrackerListDto.consultFnbOwnerStatus,
        adminProformaEventTrackerListDto.exclude('consultFnbOwnerStatus'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminProformaEventTrackerListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  async findOneForAdmin(id: number): Promise<ProformaEventTracker> {
    const qb = await this.proformaEventTrackerRepo
      .createQueryBuilder('tracker')
      .CustomInnerJoinAndSelect(['proformaConsult'])
      .CustomLeftJoinAndSelect(['consult'])
      .where('tracker.id = :id', { id: id })
      .getOne();
    if (!qb) {
      throw new NotFoundException();
    }
    return qb;
  }

  /**
   * return all registered ips
   * @param pagination
   * @returns
   */
  async findIpAddresses(
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProformaEventTracker>> {
    const qb = this.proformaEventTrackerRepo
      .createQueryBuilder('tracker')
      .groupBy('tracker.ipAddress')
      .Paginate(pagination)
      .getManyAndCount();

    const [items, totalCount] = await qb;

    return { items, totalCount };
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
    if (!checkIpAddress) {
      newRecord.proformaConsultId = proforma.id;
      newRecord.fnbOwnerStatus = proforma.fnbOwnerStatus;
      newRecord.ipAddress = proforma.ipAddress;
      newRecord = await this.proformaEventTrackerRepo.save(newRecord);
    }
    if (checkIpAddress) {
      const checkTime = this.__check_if_over_thirty_minutes(checkIpAddress);
      if (checkTime) {
        newRecord.proformaConsultId = proforma.id;
        newRecord.ipAddress = proforma.ipAddress;
        newRecord.fnbOwnerStatus = proforma.fnbOwnerStatus;
        newRecord = await this.proformaEventTrackerRepo.save(newRecord);
      }
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
      return true;
    } else {
      return false;
    }
  }
}
