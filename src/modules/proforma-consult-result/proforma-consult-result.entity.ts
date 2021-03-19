import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import {
  AGE_GROUP,
  BRAND_CONSULT,
  FNB_OWNER,
  KB_FOOD_CATEGORY,
  KB_MEDIUM_CATEGORY,
  OPERATION_TIME,
  REVENUE_RANGE,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';
import { CommonCode } from '../common-code/common-code.entity';
import { ResponseArrayClass } from '../aggregate-result-response/aggregate-result-resource.service';
import { Question } from '../question/question.entity';

@Entity({ name: 'proforma_consult_result' })
export class ProformaConsultResult extends BaseEntity<ProformaConsultResult> {
  @Column({
    name: 'aggregate_response_id',
    type: 'int',
    nullable: false,
  })
  aggregateResponseId: number;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;

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
  isReadyCode: TENTATIVE_OPEN_OPTION;

  @Column({
    name: 'is_ready_grade',
    type: 'int',
  })
  isReadyGrade: number;

  @Column({
    name: 'selected_kb_medium_category',
    type: 'varchar',
  })
  selectedKbMediumCategory: KB_MEDIUM_CATEGORY;

  @Column({
    name: 'operation_times',
    type: 'json',
  })
  operationTimes?: OPERATION_TIME[];

  @Column({
    name: 'operation_times_result',
    type: 'json',
  })
  operationTimesResult?: ResponseArrayClass[];

  @Column({
    name: 'delivery_restaurant_ratio_grade',
    type: 'int',
  })
  deliveryRatioGrade: number;

  @Column({
    name: 'operation_sentence_id',
    type: 'int',
  })
  operationSentenceId: number;

  @Column({
    name: 'graph_data',
    type: 'json',
  })
  graphData: any;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'fnb_owner_status', referencedColumnName: 'key' })
  fnbOwnerCodeStatus?: CommonCode;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'revenue_range_code', referencedColumnName: 'key' })
  revenueRangeCodeStatus?: CommonCode;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'age_group_code', referencedColumnName: 'key' })
  ageGroupCodeStatus?: CommonCode;

  @ManyToMany(
    type => Question,
    question => question.proformas,
  )
  @JoinTable({
    name: 'question_proforma_mapper',
    joinColumn: { name: 'proforma_consult_result_id' },
    inverseJoinColumn: { name: 'question_id' },
  })
  questions?: Question[];
}
