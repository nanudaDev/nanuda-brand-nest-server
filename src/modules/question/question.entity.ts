import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonCode } from '../common-code/common-code.entity';
import { QuestionGiven } from '../question-given/question-given.entity';

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

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'user_type', referencedColumnName: 'key' })
  commonCode?: CommonCode;

  //   질문 보기 join
  @OneToMany(
    type => QuestionGiven,
    givens => givens.question,
  )
  givens?: QuestionGiven[];
}
