import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../core/base.service';
import { PickcookSales } from '../entities/pickcook-sales.entity';
import { Repository } from 'typeorm';
import { AdminPickcookSalesQueryDto } from './dto';
import { BrandAiException } from '../../../core/errors/brand-ai.exception';

@Injectable()
export class PickcookSalesService extends BaseService {
  constructor(
    @InjectRepository(PickcookSales, 'wq')
    private readonly pickCookSalesRepo: Repository<PickcookSales>,
  ) {
    super();
  }

  /**
   * find pickcook data
   * @param adminPickcookSalesQueryDto
   * @returns
   */
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
      //   .where('pickcookSales.hdongCode = :hdongCode', {
      //     hdongCode: adminPickcookSalesQueryDto.hdongCode,
      //   })
      .getOne();
    console.log(qb);
    if (!qb) throw new BrandAiException('pickcookSales.notFound');

    return qb;
  }
}
