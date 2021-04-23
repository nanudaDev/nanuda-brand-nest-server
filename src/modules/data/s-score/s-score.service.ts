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

  //   async findAll(sScoreListDto: SScoreListDto, tableType: RESTAURANT_TYPE): Promise<>
}
