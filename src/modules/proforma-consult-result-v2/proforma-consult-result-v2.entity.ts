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
import { CScoreAttribute } from '../data';
import { Json } from 'aws-sdk/clients/robomaker';

@Entity({ name: 'proforma_consult_result_v2' })
export class ProformaConsultResultV2 extends BaseEntity<
  ProformaConsultResultV2
> {
  @Column({
    name: 'c_score_attribute_id',
    type: 'int',
  })
  cScoreAttributeId: number;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;

  @Column({
    name: 'selected_kb_medium_category',
    type: 'varchar',
  })
  selectedKbMediumCategory: KB_MEDIUM_CATEGORY;

  @Column({
    name: 'selected_kb_medium_category_name',
    type: 'varchar',
  })
  selectedKbMediumCategoryName: string;

  @Column({ type: 'json' })
  hdong: any;

  @Column({
    name: 'total_question_menu_score',
    type: 'decimal',
  })
  totalQuestionMenuScore: number;

  @Column({
    name: 'total_question_managing_score',
    type: 'decimal',
  })
  totalQuestionManagingScore: number;

  @Column({
    name: 'total_question_initial_cost_score',
    type: 'decimal',
  })
  totalQuestionInitialCostScore: number;

  @Column({
    name: 'rank_data_w_c_score',
    type: 'json',
  })
  rankDataWCScore: any;

  @Column({
    name: 'delivery_ratio_data',
    type: 'json',
  })
  deliveryRatioData: any;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'fnb_owner_status', referencedColumnName: 'key' })
  fnbOwnerCodeStatus?: CommonCode;

  @OneToOne(type => CScoreAttribute)
  @JoinColumn({ name: 'c_score_attribute_id' })
  cScoreAttribute?: CScoreAttribute;

  // @OneToOne(type => CommonCode)
  // @JoinColumn({ name: 'revenue_range_code', referencedColumnName: 'key' })
  // revenueRangeCodeStatus?: CommonCode;

  // @OneToOne(type => CommonCode)
  // @JoinColumn({ name: 'age_group_code', referencedColumnName: 'key' })
  // ageGroupCodeStatus?: CommonCode;

  // @ManyToMany(
  //   type => Question,
  //   question => question.proformas,
  // )
  // @JoinTable({
  //   name: 'question_proforma_mapper',
  //   joinColumn: { name: 'proforma_consult_result_id' },
  //   inverseJoinColumn: { name: 'question_id' },
  // })
  // questions?: Question[];
}
