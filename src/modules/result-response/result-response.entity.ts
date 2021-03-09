import { BaseEntity } from 'src/core';
import {
  AGE_GROUP,
  EXP_GROUP,
  FNB_OWNER,
  HOW_SKILL,
  REVENUE_RANGE,
  SKILL_GROUP,
} from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'result_response' })
export class ResultResponse extends BaseEntity<ResultResponse> {
  @Column({
    type: 'text',
  })
  response: string;

  @Column({
    name: 'response_code',
    type: 'varchar',
  })
  responseCode: string;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;

  @Column({
    name: 'age_group',
    type: 'varchar',
  })
  ageGroup: AGE_GROUP;

  @Column({
    name: 'exp_group',
    type: 'varchar',
  })
  expGroup: EXP_GROUP;

  @Column({
    name: 'skill_group',
    type: 'varchar',
  })
  skillGroup: SKILL_GROUP;

  @Column({
    name: 'how_skill_group',
    type: 'varchar',
  })
  howSkillGroup: HOW_SKILL;

  @Column({
    name: 'revenue_range',
    type: 'varchar',
  })
  revenueRange: REVENUE_RANGE;
}
