import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { ConsultResult } from './consult-result.entity';
import { AdminConsultResultListDto } from './dto';

@Injectable()
export class ConsultResultService extends BaseService {
  constructor(
    @InjectRepository(ConsultResult)
    private readonly consultRepo: Repository<ConsultResult>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminConsultResultListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminConsultResultListDto: AdminConsultResultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResult>> {
    const qb = this.consultRepo
      .createQueryBuilder('consult')
      .CustomInnerJoinAndSelect([
        'revenueRangeCodeStatus',
        'fnbOwnerCodeStatus',
        'ageGroupCodeStatus',
      ])
      .AndWhereLike(
        'consult',
        'ageGroupCode',
        adminConsultResultListDto.ageGroupCode,
        adminConsultResultListDto.exclude('ageGroupCode'),
      )
      .AndWhereLike(
        'consult',
        'revenueRangeCode',
        adminConsultResultListDto.revenueRangeCode,
        adminConsultResultListDto.exclude('revenueRangeCode'),
      )
      .AndWhereLike(
        'consult',
        'isReadyCode',
        adminConsultResultListDto.isReadyCode,
        adminConsultResultListDto.exclude('isReadyCode'),
      )
      .AndWhereLike(
        'consult',
        'name',
        adminConsultResultListDto.name,
        adminConsultResultListDto.exclude('name'),
      )
      .AndWhereLike(
        'consult',
        'phone',
        adminConsultResultListDto.phone,
        adminConsultResultListDto.exclude('phone'),
      )
      .AndWhereEqual(
        'consult',
        'deliveryRatioGrade',
        adminConsultResultListDto.deliveryRatioGrade,
        adminConsultResultListDto.exclude('deliveryRatioGrade'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminConsultResultListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
