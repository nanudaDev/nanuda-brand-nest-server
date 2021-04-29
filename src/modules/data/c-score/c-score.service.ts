import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
  YN,
} from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CScoreAttribute } from '..';
import {
  AdminCScoreAttributeCreateDto,
  AdminCScoreAttributeListDto,
} from './dto';

@Injectable()
export class CScoreService extends BaseService {
  constructor(
    @InjectRepository(CScoreAttribute)
    private readonly cScoreAttributeRepo: Repository<CScoreAttribute>,
  ) {
    super();
  }

  /**
   * create new C-Score attribute
   */
  async createCScoreAttribute(
    adminCScoreAttributeCreateDto: AdminCScoreAttributeCreateDto,
  ): Promise<CScoreAttribute> {
    let newAttribute = new CScoreAttribute(adminCScoreAttributeCreateDto);
    const checkAttribute = await this.cScoreAttributeRepo.find(
      adminCScoreAttributeCreateDto,
    );
    if (checkAttribute && checkAttribute.length < 0) return newAttribute;
    newAttribute = await this.cScoreAttributeRepo.save(newAttribute);
    return newAttribute;
  }

  /**
   * find all c-score attribute for admin
   * @param adminCScoreListDto
   * @param pagination
   * @returns
   */
  async findAllForAdmin(
    adminCScoreListDto: AdminCScoreAttributeListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CScoreAttribute>> {
    const qb = this.cScoreAttributeRepo
      .createQueryBuilder('cScoreAttribute')
      .AndWhereEqual(
        'cScoreAttribute',
        'highestMenuScore',
        adminCScoreListDto.highestMenuScore,
        adminCScoreListDto.exclude('highestMenuScore'),
      )
      .AndWhereEqual(
        'cScoreAttribute',
        'highestManagingScore',
        adminCScoreListDto.highestManagingScore,
        adminCScoreListDto.exclude('highestManagingScore'),
      )
      .AndWhereEqual(
        'cScoreAttribute',
        'highestInitialCostScore',
        adminCScoreListDto.highestInitialCostScore,
        adminCScoreListDto.exclude('highestInitialCostScore'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminCScoreListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find recent valid c score attribute
   * @returns
   */
  async findValid(): Promise<CScoreAttribute> {
    const cScoreAttribute = await this.cScoreAttributeRepo
      .createQueryBuilder('cScore')
      .where('cScore.inUse = :inUser', { inUse: YN.YES })
      .orderBy('cScore.id', ORDER_BY_VALUE.DESC)
      .limit(1)
      .getMany();

    return cScoreAttribute[0];
  }
}
