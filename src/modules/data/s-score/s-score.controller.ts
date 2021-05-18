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

  /**
   * delivery type
   * @param sScoreListDto
   * @returns
   */
  @Get('/s-score-delivery-menu-w-medium-code')
  async findAllDeliveryWithMediumCode(
    @Query() sScoreListDto: SScoreListDto,
  ): Promise<SScoreDelivery[]> {
    return await this.sScoreService.findAllWithMediumCategoryCode(
      sScoreListDto,
      RESTAURANT_TYPE.DELIVERY,
    );
  }

  /**
   * Restaurant type
   * @param sScoreListDto
   * @returns
   */
  @Get('/s-score-restaurant-menu-w-medium-code')
  async findAllRestaurantithMediumCode(
    @Query() sScoreListDto: SScoreListDto,
  ): Promise<SScoreRestaurant[]> {
    return await this.sScoreService.findAllWithMediumCategoryCode(
      sScoreListDto,
      RESTAURANT_TYPE.RESTAURANT,
    );
  }

  /**
   * delivery s-score other
   * @param sScoreListDto
   * @returns
   */
  @Get('/s-score-delivery-other')
  async findAllSScoreDeliveryOther(
    @Query() sScoreListDto: SScoreListDto,
  ): Promise<SScoreDelivery[]> {
    sScoreListDto.restaurantType = RESTAURANT_TYPE.DELIVERY;
    return await this.sScoreService.findSecondarySScore(
      sScoreListDto,
      sScoreListDto.restaurantType,
    );
  }

  /**
   * restaurant s-score other
   * @param sScoreListDto
   * @returns
   */
  @Get('/s-score-restaurant-other')
  async findAllSScoreRestaurantOther(
    @Query() sScoreListDto: SScoreListDto,
  ): Promise<SScoreRestaurant[]> {
    sScoreListDto.restaurantType = RESTAURANT_TYPE.RESTAURANT;
    return await this.sScoreService.findSecondarySScore(
      sScoreListDto,
      sScoreListDto.restaurantType,
    );
  }
}
