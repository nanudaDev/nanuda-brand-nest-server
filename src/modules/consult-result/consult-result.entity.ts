import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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
import { OperationSentenceResponse } from '../aggregate-result-response/operation-sentence-response.entity';
import { ProformaConsultResult } from '../proforma-consult-result/proforma-consult-result.entity';
import { Reservation } from '../reservation/reservation.entity';

@Entity({ name: 'consult_result' })
export class ConsultResult extends BaseEntity<ConsultResult> {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId: number;

  @Column({
    name: 'proforma_consult_result_id',
    type: 'int',
  })
  proformaConsultResultId: number;

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
    name: 'consult_status',
    nullable: false,
    default: () => BRAND_CONSULT.NEW_CONSULT,
  })
  consultStatus: BRAND_CONSULT;

  @Column({
    name: 'operation_sentence_id',
    type: 'int',
  })
  operationSentenceId: number;

  @Column({
    name: 'reservation_code',
    type: 'varchar',
  })
  reservationCode: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    name: 'consult_complete_date',
    type: 'datetime',
  })
  consultCompleteDate: Date;

  @Column({
    name: 'consult_drop_date',
    type: 'datetime',
  })
  consultDropDate: Date;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'fnb_owner_status', referencedColumnName: 'key' })
  fnbOwnerCodeStatus?: CommonCode;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'revenue_range_code', referencedColumnName: 'key' })
  revenueRangeCodeStatus?: CommonCode;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'age_group_code', referencedColumnName: 'key' })
  ageGroupCodeStatus?: CommonCode;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'consult_status', referencedColumnName: 'key' })
  consultCodeStatus?: CommonCode;

  @OneToOne(type => OperationSentenceResponse)
  @JoinColumn({ name: 'operation_sentence_id' })
  operationSentenceResponse?: OperationSentenceResponse;

  @OneToOne(type => ProformaConsultResult)
  @JoinColumn({ name: 'proforma_consult_result_id' })
  proforma?: ProformaConsultResult;

  @OneToOne(type => Reservation)
  @JoinColumn({ name: 'id', referencedColumnName: 'consultId' })
  reservation?: Reservation;

  // add admin entity later
  admin?: any;
}
