import {
  PICKCOOK_SALES_TYPE,
  PICKCOOK_SALES_REVENUE_PER_ORDER,
  PICKCOOK_SALES_AGE_GROUP,
  PICKCOOK_SALES_GENDER_TYPE,
  PICKCOOK_SALES_GU_DONG,
} from 'src/common';
import {
  Column,
  Entity,
  Index,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseWqEntity } from '../../../core/base-wq.entity';
import { CodeHdong } from '../../code-hdong/code-hdong.entity';
import { KbFoodCategoryGroup } from './kb-food-category-group.entity';
import { KB_MEDIUM_CATEGORY } from '../../../shared/common-code.type';
import { SScoreRestaurant } from './s-score-restaurant.entity';
import { SScoreDelivery } from './s-score-delivery.entity';

@Entity({ name: 'pickcook_sales' })
// TODO: ADD INDEX for hdongCode and mediumCategorycode
@Index('idx_pickcook_sales_hdong_medium_code', [
  'hdongCode',
  'mediumCategoryCode',
])
export class PickcookSales extends BaseWqEntity<PickcookSales> {
  @Column({
    type: 'int',
  })
  yymm: number;

  @Column({
    type: 'bigint',
  })
  hdongCode: number;

  @Column({
    type: 'varchar',
  })
  mediumCategoryCode: KB_MEDIUM_CATEGORY;

  @Column({
    type: 'bigint',
  })
  minRevenue: number;

  @Column({
    type: 'bigint',
  })
  medianRevenue: number;

  @Column({
    type: 'bigint',
  })
  maxRevenue: number;

  @Column({
    type: 'bigint',
  })
  livingPopulation: number;

  @Column({
    type: 'bigint',
  })
  sedeCount: number;

  @Column({
    type: 'bigint',
  })
  employeeCount: number;

  @Column({
    type: 'json',
  })
  gaguRatio: any;

  @Column({
    type: 'int',
  })
  mainGagu: number;

  @Column({
    type: 'double',
  })
  mainGaguRatio: number;

  @Column({
    type: 'double',
  })
  mainAgeGroupRatio: number;

  @Column({
    type: 'json',
  })
  ageRatio: any;

  @Column({
    type: 'int',
  })
  mainAgeGroup: number;

  @Column({
    type: 'double',
  })
  offlineRevenueRatio: number;

  @Column({
    type: 'int',
  })
  deliveryRevenueRatio: number;

  @Column({
    type: 'varchar',
  })
  guDongType: PICKCOOK_SALES_GU_DONG;

  @Column({
    type: 'double',
  })
  mediumCategoryStoreRatio: number;

  @Column({
    type: 'double',
  })
  closedStoreRate: number;

  @Column({
    type: 'double',
  })
  mediumCategoryClosedStoreRate: number;

  @Column({
    type: 'double',
  })
  survivalYears: number;

  @Column({
    type: 'double',
  })
  mediumCategorySurvivalYears: number;

  @Column({
    type: 'varchar',
  })
  storeType: PICKCOOK_SALES_TYPE;

  @Column({
    type: 'json',
  })
  mediumCategoryRevenueRatio: any;

  @Column({
    type: 'json',
  })
  mediumCategoryGenderRevenueRatio: any;

  @Column({
    type: 'int',
  })
  mainAge: number;

  @Column({
    type: 'varchar',
  })
  revenuePerOrder: PICKCOOK_SALES_REVENUE_PER_ORDER;

  @Column({
    type: 'json',
  })
  weekDayRevenueRatio: any;

  @Column({
    type: 'json',
  })
  hourRevenueRatio: any;

  @Column({
    type: 'json',
  })
  recommendedMenu: any;

  // @Column({
  //   type: 'json',
  // })
  // scoreValues: any;

  @Column({
    type: 'varchar',
  })
  mainHourHdong: string;

  @Column({
    type: 'int',
  })
  mainGenderHdong: PICKCOOK_SALES_GENDER_TYPE;

  @Column({
    type: 'varchar',
  })
  mainAgeHdong: PICKCOOK_SALES_AGE_GROUP;

  @Column({
    type: 'json',
  })
  recommendMenuHdong: any;

  sScoreMenus?: SScoreRestaurant[] | SScoreDelivery[];

  @OneToOne(type => CodeHdong)
  @JoinColumn({ name: 'hdongCode', referencedColumnName: 'hdongCode' })
  hdong?: CodeHdong;

  @ManyToOne(
    type => KbFoodCategoryGroup,
    kbFoodCategory => kbFoodCategory.pickcookSales,
  )
  @JoinColumn({
    name: 'mediumCategoryCode',
    referencedColumnName: 'mediumCategoryCd',
  })
  kbCategory?: KbFoodCategoryGroup;
}
