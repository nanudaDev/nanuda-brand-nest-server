import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { PickcookSmallCategoryInfo } from '../entities';

@Injectable()
export class PickcookSmallCategoryService extends BaseService {
  constructor(
    @InjectRepository(PickcookSmallCategoryInfo, 'wq')
    private readonly smallCategoryInfo: Repository<PickcookSmallCategoryInfo>,
  ) {
    super();
  }

  /**
   * find one for small category info
   * @param sSmallCategoryCode
   * @returns
   */
  async findOne(sSmallCategoryCode: string) {
    return await this.smallCategoryInfo.findOne({ sSmallCategoryCode });
  }
}
