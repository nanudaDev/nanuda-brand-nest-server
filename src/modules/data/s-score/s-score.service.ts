import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RESTAURANT_TYPE } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { SScoreDelivery, SScoreRestaurant } from '../entities';
import { SScoreListDto } from './dto';
import { ORDER_BY_VALUE } from '../../../common/interfaces/order-by-value.type';
import { KB_MEDIUM_CATEGORY } from '../../../shared/common-code.type';

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

  /**
   * find with medium category code
   * @param sScoreListdto
   * @param restaurantType
   * @returns
   */
  async findAllWithMediumCategoryCode(
    sScoreListdto: SScoreListDto,
    restaurantType: RESTAURANT_TYPE,
  ): Promise<SScoreRestaurant[] | SScoreDelivery[]> {
    let qb;
    if (restaurantType === RESTAURANT_TYPE.RESTAURANT) {
      qb = this.scoreRestaurantRepo
        .createQueryBuilder('restaurant')
        .CustomInnerJoinAndSelect(['attributeValues'])
        .CustomLeftJoinAndSelect(['pickcookSmallCategoryInfo'])
        .where('restaurant.hdongCode = :hdongCode', {
          hdongCode: sScoreListdto.hdongCode,
        })
        .andWhere('restaurant.mediumCategoryCode = :mediumCategoryCode', {
          mediumCategoryCode: sScoreListdto.mediumCategoryCode,
        })
        .limit(3)
        .orderBy('restaurant.averageScore', ORDER_BY_VALUE.DESC)
        .getMany();
    }
    if (restaurantType === RESTAURANT_TYPE.DELIVERY) {
      qb = this.scoreDeliveryRepo
        .createQueryBuilder('delivery')
        .CustomInnerJoinAndSelect(['attributeValues'])
        .CustomLeftJoinAndSelect(['pickcookSmallCategoryInfo'])
        .where('delivery.hdongCode = :hdongCode', {
          hdongCode: sScoreListdto.hdongCode,
        })
        .andWhere('delivery.mediumCategoryCode = :mediumCategoryCode', {
          mediumCategoryCode: sScoreListdto.mediumCategoryCode,
        })
        .limit(3)
        .orderBy('delivery.averageScore', ORDER_BY_VALUE.DESC)
        .getMany();
    }

    return await qb;
  }

  /**
   * find the next category
   * @param sScoreListDto
   * @param restaurantType
   * @param mediumCategoryCode
   */
  async findSecondarySScore(
    sScoreListDto: SScoreListDto,
    restaurantType: RESTAURANT_TYPE,
  ): Promise<SScoreRestaurant[] | SScoreDelivery[]> {
    let qb;
    if (restaurantType === RESTAURANT_TYPE.RESTAURANT) {
      qb = this.scoreRestaurantRepo
        .createQueryBuilder('restaurant')
        .CustomInnerJoinAndSelect(['attributeValues'])
        .CustomLeftJoinAndSelect(['pickcookSmallCategoryInfo'])
        .where('restaurant.hdongCode = :hdongCode', {
          hdongCode: sScoreListDto.hdongCode,
        })
        .andWhere(`restaurant.mediumCategoryCode != :code`, {
          code: sScoreListDto.mediumCategoryCode,
        })
        .limit(3)
        .orderBy('restaurant.averageScore', ORDER_BY_VALUE.DESC)
        .getMany();
    }
    if (restaurantType === RESTAURANT_TYPE.DELIVERY) {
      qb = this.scoreDeliveryRepo
        .createQueryBuilder('delivery')
        .CustomInnerJoinAndSelect(['attributeValues'])
        .CustomLeftJoinAndSelect(['pickcookSmallCategoryInfo'])
        .where('delivery.hdongCode = :hdongCode', {
          hdongCode: sScoreListDto.hdongCode,
        })
        .andWhere(`delivery.mediumCategoryCode != :code`, {
          code: sScoreListDto.mediumCategoryCode,
        })
        .limit(3)
        .orderBy('delivery.averageScore', ORDER_BY_VALUE.DESC)
        .getMany();
    }

    return await qb;
  }
}
