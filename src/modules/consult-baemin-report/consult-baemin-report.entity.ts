import { BAEMIN_CATEGORY_CODE } from 'src/common';
import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../core';
import { KB_MEDIUM_CATEGORY } from '../../shared';
import { ConsultResultV3 } from '../consult-result-v3/consult-result-v3.entity';

@Entity({ name: 'consult_baemin_report' })
@Index('idx_consult_baemin_report_consult_id', ['consultId'])
export class ConsultBaeminReport extends BaseEntity<ConsultBaeminReport> {
  @Column({
    name: 'consult_id',
    type: 'int',
  })
  consultId: number;

  @Column({
    name: 'hdong_code',
    type: 'int',
  })
  hdongCode: string | number;

  @Column({
    name: 'medium_category_code',
    type: 'varchar',
  })
  mediumCategoryCode: KB_MEDIUM_CATEGORY | string;

  //   평점
  @Column({
    name: 'average_score',
    type: 'int',
  })
  averageScore: number;

  //   평균  주문수
  @Column({
    name: 'average_order_rate',
    type: 'int',
  })
  averageOrderRate: number;

  //   월 평균 주문수
  @Column({
    name: 'average_monthly_order_rate',
    type: 'int',
  })
  averageMonthlyOrderRate: number;

  //   최소 주문금액
  @Column({
    name: 'minimum_order_price',
    type: 'int',
  })
  minimumOrderPrice?: number;

  //   배달팁
  @Column({
    name: 'average_delivery_tip',
    type: 'int',
  })
  averageDeliveryTip: number;

  //   찜 수
  @Column({
    name: 'average_like_rate',
    type: 'int',
  })
  averageLikeRate: number;

  @Column({
    name: 'baemin_category_code',
    type: 'varchar',
  })
  baeminCategoryCode: BAEMIN_CATEGORY_CODE | string;

  @OneToOne(
    type => ConsultResultV3,
    consult => consult.consultBaeminReport,
  )
  @JoinColumn({ name: 'consult_id' })
  consult?: ConsultResultV3;
}
