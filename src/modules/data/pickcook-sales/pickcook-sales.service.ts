import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../core/base.service';
import { PickcookSales } from '../entities/pickcook-sales.entity';
import { Repository } from 'typeorm';
import { AdminPickcookSalesQueryDto } from './dto';
import { BrandAiException } from '../../../core/errors/brand-ai.exception';
import { SScoreService } from '../s-score/s-score.service';
import { SScoreListDto } from '../s-score/dto';

@Injectable()
export class PickcookSalesService extends BaseService {
  constructor(
    @InjectRepository(PickcookSales, 'wq')
    private readonly pickCookSalesRepo: Repository<PickcookSales>,
    private readonly sScoreService: SScoreService,
  ) {
    super();
  }

  /**
   * find pickcook data
   * @param adminPickcookSalesQueryDto
   * @returns
   */
  // TODO: 행정동에 존재하지 않는 데이터 조인
  async findPickcookSales(
    adminPickcookSalesQueryDto: AdminPickcookSalesQueryDto,
  ): Promise<PickcookSales> {
    const qb = await this.pickCookSalesRepo
      .createQueryBuilder('pickcookSales')
      .CustomInnerJoinAndSelect(['hdong', 'kbCategory'])
      .AndWhereEqual(
        'pickcookSales',
        'hdongCode',
        adminPickcookSalesQueryDto.hdongCode,
      )
      .AndWhereEqual(
        'pickcookSales',
        'mediumCategoryCode',
        adminPickcookSalesQueryDto.mediumCategoryCode,
      )
      .AndWhereEqual(
        'pickcookSales',
        'storeType',
        adminPickcookSalesQueryDto.storeType,
      )
      .getOne();

    if (!qb) throw new BrandAiException('pickcookSales.notFound');

    return qb;
  }
}
