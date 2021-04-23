import { BaseWqEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'pickcook_s_score_delivery' })
export class SScoreDelivery extends BaseWqEntity<SScoreDelivery> {
  @Column({
    type: 'bigint',
  })
  yymm: number;

  @Column({
    type: 'bigint',
  })
  hdongCode: number | string;

  @Column({
    type: 'varchar',
  })
  sSmallCategoryCode: string;

  @Column({
    type: 'varchar',
  })
  mediumCategoryCode: string;

  @Column({
    type: 'bigint',
  })
  smallCategoryRevenueScore: string;

  @Column({
    type: 'bigint',
  })
  mediumCategoryRevenueScore: string;

  @Column({
    type: 'bigint',
  })
  revenueChangeRateScore: string;

  @Column({
    type: 'bigint',
  })
  workingPopulationScore: string;

  @Column({
    type: 'bigint',
  })
  livingPopulationScore: string;

  @Column({
    type: 'bigint',
  })
  floatingPopulationScore: string;

  @Column({
    type: 'bigint',
  })
  storeRateScore: string;

  @Column({
    type: 'bigint',
  })
  aggregateScore: string;

  @Column({
    type: 'bigint',
  })
  averageScore: string;

  @Column({
    type: 'bigint',
  })
  rankByHdong: string;
}
