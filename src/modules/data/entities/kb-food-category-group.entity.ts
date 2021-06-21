import { BaseEntity, BaseMapperEntity } from 'src/core';
import { KB_FOOD_CATEGORY } from 'src/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { KbOfflineSpacePurchaseRecord } from './kb-offline-space-purchase-record.entity';
import { PickcookSales } from './pickcook-sales.entity';

@Entity({ name: 'kb_food_category_group' })
export class KbFoodCategoryGroup extends BaseEntity<KbFoodCategoryGroup> {
  @Column({
    name: 's_small_category_cd',
    type: 'varchar',
  })
  sSmallCategoryCd: string;

  @Column({
    name: 's_small_category_nm',
    type: 'varchar',
  })
  sSmallCategoryNm: string;

  @Column({
    name: 'small_category_cd',
    type: 'varchar',
  })
  smallCategoryCd: string;

  @Column({
    name: 'small_category_nm',
    type: 'varchar',
  })
  smallCategoryNm: string;

  @Column({
    name: 'medium_category_cd',
    type: 'varchar',
  })
  mediumCategoryCd: string;

  @Column({
    name: 'medium_category_nm',
    type: 'varchar',
  })
  mediumCategoryNm: KB_FOOD_CATEGORY;

  @Column({
    name: 'large_category_cd',
    type: 'varchar',
  })
  largeCategoryCd: string;

  @Column({
    name: 'large_category_nm',
    type: 'varchar',
  })
  largeCategoryNm: string;

  @Column({
    type: 'int',
    default: 0,
  })
  score: number;

  @Column({
    name: 'medium_small_category_nm',
    type: 'varchar',
  })
  mediumSmallCategoryNm: string;

  /**
   * 자동화 픽쿡 데이터 조인
   */
  @OneToMany(
    type => PickcookSales,
    pickcooksales => pickcooksales.kbCategory,
  )
  pickcookSales?: PickcookSales;
}
