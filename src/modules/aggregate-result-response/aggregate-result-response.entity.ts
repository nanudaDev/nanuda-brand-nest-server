import { BaseEntity } from 'src/core';
import { AGE_GROUP, FNB_OWNER, REVENUE_RANGE } from 'src/shared';
import { Column, Entity } from 'typeorm';
import { OperationSentenceResponse } from './operation-sentence-response.entity';

@Entity({ name: 'aggregate_result_response' })
export class AggregateResultResponse extends BaseEntity<
  AggregateResultResponse
> {
  @Column({
    name: 'delivery_restaurant_ratio_grade',
    type: 'int',
  })
  deliveryRatioGrade: number;

  @Column({
    name: 'delivery_restaurant_ratio_code',
    type: 'varchar',
  })
  deliveryRatioCode: string;

  @Column({
    name: 'response_code',
    type: 'varchar',
  })
  responseCode: string;

  @Column({
    name: 'age_group_grade',
    type: 'int',
  })
  ageGroupGrade: number;

  @Column({
    name: 'age_group_code',
    type: 'varchar',
  })
  ageGroupCode: AGE_GROUP;

  @Column({
    name: 'revenue_range_code',
    type: 'varchar',
  })
  revenueRangeCode: REVENUE_RANGE;

  @Column({
    name: 'revenue_range_grade',
    type: 'int',
  })
  revenueRangeGrade: number;

  @Column({
    name: 'is_ready_code',
    type: 'varchar',
  })
  isReadyCode: string;

  @Column({
    name: 'is_ready_grade',
    type: 'int',
  })
  isReadyGrade: number;

  @Column({
    type: 'text',
  })
  response: string;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;

  // 운영 전략 문장
  operationSentence?: OperationSentenceResponse;
}
