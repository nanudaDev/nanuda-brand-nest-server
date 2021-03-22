import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonCode } from '../common-code/common-code.entity';
import { ProformaConsultResult } from '../proforma-consult-result/proforma-consult-result.entity';
import { QuestionGiven } from '../question-given/question-given.entity';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';

@Entity({ name: 'question' })
export class Question extends BaseEntity<Question> {
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
    type: 'int',
  })
  order: number;

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

  //   질문 보기 join
  @OneToMany(
    type => QuestionGiven,
    givens => givens.question,
  )
  givens?: QuestionGiven[];

  @ManyToMany(
    type => ProformaConsultResult,
    proforma => proforma.questions,
  )
  @JoinTable({
    name: 'question_proforma_mapper',
    joinColumn: { name: 'question_id' },
    inverseJoinColumn: { name: 'proforma_consult_result_id' },
  })
  proformas?: ProformaConsultResult[];

  @OneToMany(
    type => QuestionProformaGivenMapper,
    answeredGiven => answeredGiven.question,
  )
  answeredGiven?: QuestionProformaGivenMapper[];
}
