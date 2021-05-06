import { BaseWqEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PickcookSmallCategoryInfo } from '.';
import { SScoreAttributeValuesRestaurant } from './s-score-attribute-values-restaurant.entity';

@Entity({ name: 'pickcook_s_score_restaurant' })
export class SScoreRestaurant extends BaseWqEntity<SScoreRestaurant> {
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

  // previous ranking
  appliedNewRanking?: number;

  // no column
  // create column when banking
  estimatedHighestRevenue?: number;

  // increased from previous quarter
  estimatedIncreasedRevenuePercentage?: number;

  // 적합률
  appliedFitnessScore?: number;

  // 중분류명
  mediumCategoryName?: string;

  pickcookSmallCategoryInfo?: PickcookSmallCategoryInfo;

  // 빅데이터 상권 점수
  bigDataLocationScore?: number;

  // 조리 경험 점수
  cookingExperienceScore?: number;

  // 운영경험
  operationExperienceScore?: number;

  // 창업 자금 점수
  initialCostScore?: number;

  // 기속성 값 테이블 조인
  @OneToOne(type => SScoreAttributeValuesRestaurant)
  @JoinColumn({
    name: 'sSmallCategoryCode',
    referencedColumnName: 'sSmallCategoryCode',
  })
  attributeValues?: SScoreAttributeValuesRestaurant;
}
