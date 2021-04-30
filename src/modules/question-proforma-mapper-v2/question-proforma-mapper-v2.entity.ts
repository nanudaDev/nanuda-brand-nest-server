import { BaseMapperEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';

@Entity({ name: 'question_proforma_mapper_v2' })
export class QuestionProformaMapperV2 extends BaseMapperEntity<
  QuestionProformaMapperV2
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
    type: 'json',
  })
  givenId: number[];

  @Column({
    name: 'ip_address',
    type: 'varchar',
  })
  ipAddress: string;

  @OneToMany(
    type => QuestionProformaGivenMapper,
    givenMapper => givenMapper.questionProformaMapper,
  )
  questionGivenMapper?: QuestionProformaMapperV2[];
}
