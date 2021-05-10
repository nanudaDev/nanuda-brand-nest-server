import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RESTAURANT_TYPE } from 'src/common';
import { BaseController } from 'src/core';
import { SScoreDelivery, SScoreRestaurant } from '../entities';
import { SScoreListDto } from './dto';
import { SScoreService } from './s-score.service';

@Controller('v2')
@ApiTags('S-SCORE')
export class SScoreController extends BaseController {
  constructor(private readonly sScoreService: SScoreService) {
    super();
  }

  /**
   * find all restaurant data
   * @param sScoreListDto
   * @returns
   */
  @Get('/s-score-restaurant-menu')
  async findAllRestaurantMenu(
    @Query() sScoreListDto: SScoreListDto,
  ): Promise<SScoreRestaurant[]> {
    return await this.sScoreService.findAll(
      sScoreListDto.hdongCode,
      RESTAURANT_TYPE.RESTAURANT,
    );
  }

  /**
   * find all restaurant data
   * @param sScoreListDto
   * @returns
   */
  @Get('/s-score-delivery-menu')
  async findAllDeliveryMenu(
    @Query() sScoreListDto: SScoreListDto,
  ): Promise<SScoreRestaurant[]> {
    return await this.sScoreService.findAll(
      sScoreListDto.hdongCode,
      RESTAURANT_TYPE.DELIVERY,
    );
  }
}
