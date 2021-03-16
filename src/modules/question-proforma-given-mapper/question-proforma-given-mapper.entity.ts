import { BaseMapperEntity } from 'src/core';
import { Column, JoinColumn, ManyToOne, Entity } from 'typeorm';
import { QuestionProformaMapper } from '../question-proforma-mapper/question-proforma-mapper.entity';

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
}
