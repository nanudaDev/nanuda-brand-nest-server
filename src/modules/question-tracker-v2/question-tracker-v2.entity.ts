import { Controller } from '@nestjs/common';
import { YN } from 'src/common';
import { BaseMapperEntity } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';

@Entity({ name: 'question_tracker_v2' })
export class QuestionV2Tracker extends BaseMapperEntity<QuestionV2Tracker> {
  @Column({
    name: 'question_id',
    type: 'int',
    nullable: false,
  })
  questionId: number;

  @Column({
    name: 'user_type',
    nullable: false,
    type: 'varchar',
  })
  userType: FNB_OWNER;

  @Column({
    name: 'given_id',
    type: 'json',
    nullable: false,
  })
  givenId: number[];

  @Column({
    name: 'unique_session_id',
    nullable: false,
    type: 'varchar',
  })
  uniqueSessionId: string;

  @Column({
    name: 'ip_address',
    type: 'varchar',
  })
  ipAddress: string;

  @Column({
    name: 'is_last_question',
    type: 'char',
    default: () => YN,
  })
  isLastQuestion?: YN;

  @OneToOne(type => Question)
  @JoinColumn({ name: 'question_id' })
  question?: Question;
}
