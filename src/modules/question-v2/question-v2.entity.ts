import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { FNB_OWNER, QUESTION_TYPE } from 'src/shared';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CommonCode } from '../common-code/common-code.entity';
import { QuestionGivenV2 } from '../question-given-v2/question-given-v2.entity';

@Entity({ name: 'question_v2' })
export class QuestionV2 extends BaseEntity<QuestionV2> {
  @Column({
    type: 'text',
    nullable: false,
  })
  question: string;

  @Column({
    name: 'user_type',
    nullable: false,
    type: 'varchar',
  })
  userType: FNB_OWNER;

  @Column({
    name: 'question_type',
    nullable: false,
  })
  questionType: QUESTION_TYPE;

  @Column({
    type: 'int',
  })
  order: number;

  @Column({
    type: 'int',
    name: 'order_id',
  })
  orderId: number;

  @Column({
    name: 'is_last_question',
    default: () => YN.NO,
  })
  isLastQuestion: YN;

  @Column({
    name: 'in_use',
    type: 'char',
    length: 1,
    default: () => YN.YES,
  })
  inUse: YN;

  @Column({
    name: 'multiple_answer_yn',
    type: 'char',
    length: 1,
    default: () => YN.NO,
  })
  multipleAnswerYn: YN;

  @Column({
    name: 'parent_id',
    type: 'int',
  })
  parentId: number;

  @Column({
    name: 'has_sub_yn',
    type: 'char',
    length: 1,
    default: () => YN.NO,
  })
  hasSubYn: YN;

  @Column({
    name: 'is_sub_yn',
    type: 'char',
    length: 1,
    default: () => YN.NO,
  })
  isSubYn: YN;

  @Column({
    name: 'trigger_ids',
    type: 'json',
  })
  triggerIds?: number[];

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'user_type', referencedColumnName: 'key' })
  commonCode?: CommonCode;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'question_type', referencedColumnName: 'key' })
  questionTypeValue?: CommonCode;

  @OneToMany(
    type => QuestionGivenV2,
    givens => givens.question,
  )
  givens?: QuestionGivenV2[];
}
