import { KB_FOOD_CATEGORY } from 'src/shared';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { KbOfflineSpacePurchaseRecord } from './kb-offline-space-purchase-record.entity';

@Entity({ name: 'kb_category_info' })
export class KbCategoryInfo {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

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

  @OneToMany(
    type => KbOfflineSpacePurchaseRecord,
    offlineData => offlineData.mediumCategoryInfo,
  )
  kbOfflineData?: KbOfflineSpacePurchaseRecord[];
}
