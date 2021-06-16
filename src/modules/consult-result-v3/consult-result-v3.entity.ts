import { BaseEntity } from 'src/core';
import { BRAND_CONSULT, FNB_OWNER } from 'src/shared';
import { Column, Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CommonCode } from '../common-code/common-code.entity';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { ProformaConsultResultV3 } from '../proforma-consult-result-v3/proforma-consult-result-v3.entity';
import { YN } from '../../common/interfaces/yn.type';
import { ConsultResultV3MessageLog } from '../consult-result-v3-message-log/consult-result-v3-message-log.entity';

@Entity({ name: 'consult_result_v3' })
export class ConsultResultV3 extends BaseEntity<ConsultResultV3> {
  @Column({
    name: 'proforma_consult_result_id',
    type: 'int',
  })
  proformaConsultResultId: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'text',
  })
  description?: string;

  @Column({
    name: 'consult_status',
    nullable: false,
    default: () => BRAND_CONSULT.NEW_CONSULT,
  })
  consultStatus: BRAND_CONSULT;

  @Column({
    name: 'consult_complete_date',
    type: 'datetime',
  })
  consultCompleteDate: Date;

  @Column({
    name: 'consult_drop_date',
    type: 'datetime',
  })
  consultDropDate: Date;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId?: number;

  @Column({
    name: 'is_message_sent_yn',
    type: 'char',
    default: YN.NO,
  })
  isMessageSentYn?: YN;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'fnb_owner_status', referencedColumnName: 'key' })
  fnbOwnerCodeStatus?: CommonCode;

  @OneToOne(type => ProformaConsultResultV3)
  @JoinColumn({ name: 'proforma_consult_result_id' })
  proformaConsultResult?: ProformaConsultResultV3;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'consult_status', referencedColumnName: 'key' })
  consultCodeStatus?: CommonCode;

  @OneToMany(
    type => ConsultResultV3MessageLog,
    messages => messages.consult,
  )
  messages?: ConsultResultV3MessageLog[];

  admin?: PlatformAdmin;
}
