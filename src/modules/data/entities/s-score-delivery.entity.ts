import { BaseWqEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SScoreAttributeValuesDelivery } from './s-score-attribute-values-delivery.entity';

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
  averageScore: number;

  @Column({
    type: 'bigint',
  })
  rankByHdong: string;

  // no column needed
  appliedCScoreRanking?: number;

  // c score 반영 후 절감 점수
  appliedReductionScore?: number;

  appliedNewRanking?: number;

  // no column
  // create column when banking
  estimatedHighestRevenue?: number;

  // increased from previous quarter
  estimatedIncreasedRevenuePercentage?: number;

  appliedFitnessScore?: number;

  // 중분류명
  mediumCategoryName?: string;

  @OneToOne(type => SScoreAttributeValuesDelivery)
  @JoinColumn({
    name: 'sSmallCategoryCode',
    referencedColumnName: 'sSmallCategoryCode',
  })
  attributeValues?: SScoreAttributeValuesDelivery;
}
