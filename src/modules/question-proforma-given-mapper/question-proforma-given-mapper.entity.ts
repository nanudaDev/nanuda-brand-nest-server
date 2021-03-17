import { BaseMapperEntity } from 'src/core';
import { Column, JoinColumn, ManyToOne, Entity } from 'typeorm';
import { QuestionGiven } from '../question-given/question-given.entity';
import { QuestionProformaMapper } from '../question-proforma-mapper/question-proforma-mapper.entity';
import { Question } from '../question/question.entity';

@Entity({ name: 'question_proforma_given_mapper' })
export class QuestionProformaGivenMapper extends BaseMapperEntity<
  QuestionProformaGivenMapper
> {
  @Column({
    name: 'proforma_consult_result_id',
    type: 'int',
  })
  proformaConsultResultId: number;

  @Column({
    name: 'question_id',
    type: 'int',
  })
  questionId: number;

  @Column({
    name: 'given_id',
    type: 'int',
  })
  givenId: number;

  @Column({
    name: 'question_proforma_mapper_id',
    type: 'int',
  })
  questionProformaMapperId: number;

  @ManyToOne(
    type => QuestionProformaMapper,
    proformaMapper => proformaMapper.questionGivenMapper,
  )
  @JoinColumn({ name: 'question_proforma_mapper_id' })
  questionProformaMapper?: QuestionProformaMapper;

  @ManyToOne(
    type => Question,
    question => question.answeredGiven,
  )
  @JoinColumn({ name: 'question_id' })
  question?: Question;
}
