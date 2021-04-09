import { YN } from 'src/common';
import { BaseUserEntity } from 'src/core';
import { ACCOUNT_STATUS } from 'src/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { PickCookUserHistory } from '../pickcook-user-history/pickcook-user-history.entity';

@Entity({ name: 'pickcook_user' })
export class PickcookUser extends BaseUserEntity {
  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  username: string;

  @Column({
    name: 'service_agree_yn',
    type: 'char',
    default: () => YN.NO,
  })
  serviceAgreeYn: YN;

  @Column({
    name: 'privacy_agree_yn',
    type: 'char',
    default: () => YN.NO,
  })
  privacyAgreeYn: YN;

  @Column({
    name: 'service_agree_date',
    type: 'datetime',
  })
  serviceAgreeDate: Date;

  @Column({
    name: 'service_disagree_date',
    type: 'datetime',
  })
  serviceDisagreeDate: Date;

  @Column({
    name: 'privacy_agree_date',
    type: 'datetime',
  })
  privacyAgreeDate: Date;

  @Column({
    name: 'privacy_disagree_date',
    type: 'datetime',
  })
  privacyDisagreeDate: Date;

  @Column({
    name: 'marketing_agree_yn',
    type: 'char',
    default: () => YN,
  })
  marketingAgreeYn: YN;

  @Column({
    name: 'marketing_agree_date',
    type: 'datetime',
  })
  marketingAgreeDate: Date;

  @Column({
    name: 'marketing_disagree_date',
    type: 'datetime',
  })
  marketingDisagreeDate: Date;

  @Column({
    name: 'is_premium_user',
    type: 'char',
    default: () => YN.NO,
  })
  isPremiumUser: YN;

  @Column({
    name: 'is_premium_date',
    type: 'datetime',
  })
  isPremiumDate: YN;

  @Column({
    name: 'is_not_premium_date',
    type: 'datetime',
  })
  isNotPremiumDate: YN;

  @Column({
    name: 'is_nanuda_user_yn',
    type: 'char',
    default: YN.NO,
  })
  isNanudaUser: YN;

  @Column({
    name: 'account_status',
    type: 'varchar',
    default: () => ACCOUNT_STATUS.ACCOUNT_STATUS_ACTIVE,
  })
  accountStatus: ACCOUNT_STATUS;

  @Column({
    name: 'password_update_date',
    type: 'datetime',
  })
  passwordUpdateDate: Date;

  @OneToMany(
    type => PickCookUserHistory,
    history => history.pickcookUser,
  )
  pickcookUserHistories?: PickCookUserHistory[];
}
