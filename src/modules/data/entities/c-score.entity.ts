import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'c_score_attribute' })
export class CScoreAttribute extends BaseEntity<CScoreAttribute> {
  @Column({
    name: 'new_highest_menu_score',
    type: 'int',
  })
  newHighestMenuScore: number;

  @Column({
    name: 'new_highest_initial_cost_score',
    type: 'int',
  })
  newHighestInitialCostScore: number;

  @Column({
    name: 'new_highest_managing_score',
    type: 'int',
  })
  newHighestManagingScore: number;

  @Column({
    name: 'cur_highest_managing_score',
    type: 'int',
  })
  curHighestManagingScore: number;

  @Column({
    name: 'cur_highest_menu_score',
    type: 'int',
  })
  curHighestMenuScore: number;

  @Column({
    name: 'cur_highest_initial_cost_score',
    type: 'int',
  })
  curHighestInitialCostScore: number;

  @Column({
    type: 'decimal',
  })
  multiplier: number;

  @Column({
    name: 'in_use',
    type: 'char',
    default: () => YN.NO,
  })
  inUse: YN;
}
