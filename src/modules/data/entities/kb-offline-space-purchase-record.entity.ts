import { BaseMapperEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { KbCategoryInfo } from './kb-category-info.entity';

@Entity({ name: 'kb_offline_space_purchase_record' })
export class KbOfflineSpacePurchaseRecord extends BaseMapperEntity<
  KbOfflineSpacePurchaseRecord
> {
  @Column({
    type: 'bigint',
  })
  yymm: number;

  @Column({
    type: 'bigint',
  })
  bdongCode: number;

  @Column({
    type: 'bigint',
  })
  hdongCode: number;

  @Column({
    type: 'bigint',
  })
  storeCount: number;

  @Column({
    type: 'bigint',
  })
  weekday: number;

  @Column({
    type: 'bigint',
  })
  hour: number;

  @Column({
    type: 'bigint',
  })
  gender: number;

  @Column({
    type: 'varchar',
  })
  age: string;

  @Column({
    type: 'bigint',
  })
  revenueCount: number;

  @Column({
    type: 'bigint',
  })
  revenueAmount: number;

  @Column({
    type: 'double',
  })
  revisitRatio: number;

  @Column({
    type: 'bigint',
  })
  maxRevenueAmount: number;

  @Column({
    type: 'bigint',
  })
  minRevenueAmount: number;

  @Column({
    type: 'double',
  })
  stdRevenueAmount: number;

  @Column({
    type: 'varchar',
  })
  rank1: string;

  @Column({
    type: 'varchar',
  })
  rank2: string;

  @Column({
    type: 'varchar',
  })
  rank3: string;

  @ManyToOne(
    type => KbCategoryInfo,
    kbCategoryInfo => kbCategoryInfo.kbOfflineData,
  )
  @JoinColumn({ name: 'rank1', referencedColumnName: 'sSmallCategoryCd' })
  mediumCategoryInfo?: KbCategoryInfo;
}
