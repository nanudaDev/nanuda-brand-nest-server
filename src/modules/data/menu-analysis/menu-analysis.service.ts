import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { KbFoodCategoryGroup } from '../entities';
import { AdminKbFoodCategoryGroupListDto } from './dto';

export class MenuAnalysisService extends BaseService {
  constructor(
    @InjectRepository(KbFoodCategoryGroup, 'wq')
    private readonly kbFoodCategoryGroupRepo: Repository<KbFoodCategoryGroup>,
  ) {
    super();
  }

  /**
   * find all
   * @param adminKbFoodCategoryGroupListDto
   * @param pagination
   */
  async findAll(
    adminKbFoodCategoryGroupListDto: AdminKbFoodCategoryGroupListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<KbFoodCategoryGroup>> {
    const qb = this.kbFoodCategoryGroupRepo
      .createQueryBuilder('kbCategory')
      .AndWhereLike(
        'kbCategory',
        'sSmallCategoryNm',
        adminKbFoodCategoryGroupListDto.sSmallCategoryNm,
        adminKbFoodCategoryGroupListDto.exclude('sSmallCategoryNm'),
      )
      .AndWhereLike(
        'kbCategory',
        'mediumSmallCategoryNm',
        adminKbFoodCategoryGroupListDto.mediumSmallCategoryNm,
        adminKbFoodCategoryGroupListDto.exclude('mediumSmallCategoryNm'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminKbFoodCategoryGroupListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param id
   */
  async findOneForAdmin(id: number): Promise<KbFoodCategoryGroup> {
    const category = await this.kbFoodCategoryGroupRepo.findOne(id);
    return category;
  }
}
