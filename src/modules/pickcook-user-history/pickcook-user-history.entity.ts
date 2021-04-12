import { YN } from 'src/common';
import { BaseEntity, BaseUserEntity } from 'src/core';
import { ACCOUNT_STATUS } from 'src/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PickcookUser } from '../pickcook-user/pickcook-user.entity';

@Entity({ name: 'pickcook_user_history' })
export class PickCookUserHistory extends BaseEntity<PickCookUserHistory> {
  @Column({
    name: 'pickcook_user_id',
    type: 'int',
  })
  pickcookUserId?: number;

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
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    name: 'phone',
  })
  phone: string;

  @Column({
    type: 'datetime',
    name: 'last_login_at',
  })
  lastLoginAt?: Date;

  @Column({
    name: 'sent_dormant_warning_yn',
    type: 'char',
    default: () => YN.NO,
  })
  sentDormantWarningYn: YN;

  @Column({
    name: 'sent_dormant_warning_date',
    type: 'datetime',
  })
  sentDormantWarningDate: Date;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId: number;

  @ManyToOne(
    type => PickcookUser,
    pickcookUser => pickcookUser.pickcookUserHistories,
  )
  @JoinColumn({ name: 'pickcook_user_id' })
  pickcookUser?: PickcookUser;
}
