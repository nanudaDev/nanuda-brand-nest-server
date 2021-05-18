import { Controller } from '@nestjs/common';
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

@Entity({ name: 'question_tracker' })
export class QuestionTracker extends BaseMapperEntity<QuestionTracker> {
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
    type: 'varchar',
  })
  uniqueSessionId: string;

  @Column({
    name: 'ip_address',
    type: 'varchar',
  })
  ipAddress: string;

  @OneToOne(type => Question)
  @JoinColumn({ name: 'question_id' })
  question?: Question;
}
