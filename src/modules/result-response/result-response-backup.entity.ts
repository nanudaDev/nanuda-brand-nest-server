import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import {
  AGE_GROUP,
  EXP_GROUP,
  FNB_OWNER,
  HOW_OPERATE,
  HOW_SKILL,
  REVENUE_RANGE,
  SKILL_GROUP,
  TENTATIVE_OPEN_OPTION,
} from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'result_response_backup' })
export class ResultResponseBackup extends BaseEntity<ResultResponseBackup> {
  @Column({
    type: 'text',
  })
  response: string;

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
    name: 'how_operate_group',
    type: 'varchar',
  })
  howOperateGroup: HOW_OPERATE;

  @Column({
    name: 'tentative_open_group',
    type: 'varchar',
  })
  tentativeOpenGroup: TENTATIVE_OPEN_OPTION;

  @Column({
    name: 'revenue_range',
    type: 'varchar',
  })
  revenueRange: REVENUE_RANGE;

  @Column({
    name: 'is_transferred_yn',
    type: 'char',
    default: () => YN.NO,
  })
  isTransferredYn: YN;
}
