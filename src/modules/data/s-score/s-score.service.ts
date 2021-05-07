import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RESTAURANT_TYPE } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { SScoreDelivery, SScoreRestaurant } from '../entities';
import { SScoreListDto } from './dto';

@Injectable()
export class SScoreService extends BaseService {
  constructor(
    @InjectEntityManager('wq') private readonly wqEntityManager: EntityManager,
    @InjectRepository(SScoreRestaurant, 'wq')
    private readonly scoreRestaurantRepo: Repository<SScoreRestaurant>,
    @InjectRepository(SScoreDelivery, 'wq')
    private readonly scoreDeliveryRepo: Repository<SScoreDelivery>,
  ) {
    super();
  }

  /**
   * find best three menus
   * @param sScoreListDto
   * @param restaurantType
   * @returns
   */
  async findAll(
    hdongCode: number,
    restaurantType: RESTAURANT_TYPE,
  ): Promise<SScoreDelivery[] | SScoreRestaurant[]> {
    let qb;
    if (restaurantType === RESTAURANT_TYPE.RESTAURANT) {
      qb = this.scoreRestaurantRepo
        .createQueryBuilder('restaurant')
        .CustomInnerJoinAndSelect(['attributeValues'])
        .CustomLeftJoinAndSelect(['pickcookSmallCategoryInfo'])
        .andWhere('restaurant.hdongCode = :hdongCode', {
          hdongCode: hdongCode,
        })
        .limit(3)
        .getMany();
    }
    if (restaurantType === RESTAURANT_TYPE.DELIVERY) {
      qb = this.scoreDeliveryRepo
        .createQueryBuilder('delivery')
        .CustomInnerJoinAndSelect(['attributeValues'])
        .CustomLeftJoinAndSelect(['pickcookSmallCategoryInfo'])
        .andWhere('delivery.hdongCode = :hdongCode', {
          hdongCode: hdongCode,
        })
        .limit(3)
        .getMany();
    }

    return await qb;
  }
}
