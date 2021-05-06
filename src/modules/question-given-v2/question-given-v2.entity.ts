import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { QuestionV2 } from '../question-v2/question-v2.entity';
import { Question } from '../question/question.entity';

@Entity({ name: 'question_given_v2' })
export class QuestionGivenV2 extends BaseEntity<QuestionGivenV2> {
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
    type => QuestionV2,
    question => question.givens,
  )
  @JoinColumn({ name: 'question_id' })
  question?: QuestionV2;
}
