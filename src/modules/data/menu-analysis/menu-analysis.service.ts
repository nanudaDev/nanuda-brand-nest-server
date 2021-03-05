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

  // async findAllForAdmin(adminKbFoodCategoryGroupListDto: AdminKbFoodCategoryGroupListDto, pagination: PaginatedRequest): Promise<PaginatedResponse<KbFoodCategoryGroup>> {

  // }
}
