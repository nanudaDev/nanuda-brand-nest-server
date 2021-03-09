import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { Question } from '../question/question.entity';
import { CommonCode } from '../common-code/common-code.entity';

@Entity({ name: 'question_given' })
export class QuestionGiven extends BaseEntity<QuestionGiven> {
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'given',
  })
  given: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'value',
  })
  value: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'question_id',
  })
  questionId: number;

  @ManyToOne(
    type => Question,
    question => question.givens,
  )
  @JoinColumn({ name: 'question_id' })
  question?: Question;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'value', referencedColumnName: 'value' })
  scoreCommonCode?: CommonCode;
}
