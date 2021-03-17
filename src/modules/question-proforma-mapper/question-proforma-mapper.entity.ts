import { BaseMapperEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';
import { Question } from '../question/question.entity';

@Entity({ name: 'question_proforma_mapper' })
export class QuestionProformaMapper extends BaseMapperEntity<
  QuestionProformaMapper
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

  @OneToMany(
    type => QuestionProformaGivenMapper,
    givenMapper => givenMapper.questionProformaMapper,
  )
  questionGivenMapper?: QuestionProformaMapper[];
}
