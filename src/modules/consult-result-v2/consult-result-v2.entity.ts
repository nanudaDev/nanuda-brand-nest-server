import { BaseEntity } from 'src/core';
import { BRAND_CONSULT, FNB_OWNER } from 'src/shared';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CommonCode } from '../common-code/common-code.entity';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';

@Entity({ name: 'consult_result_v2' })
export class ConsultResultV2 extends BaseEntity<ConsultResultV2> {
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
  description: string;

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
    name: 'reservation_code',
    type: 'varchar',
  })
  reservationCode: string;

  @Column({
    name: 'response_data',
    type: 'json',
  })
  responseData?: ProformaConsultResultV2;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId?: number;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'fnb_owner_status', referencedColumnName: 'key' })
  fnbOwnerCodeStatus?: CommonCode;

  @OneToOne(type => ProformaConsultResultV2)
  @JoinColumn({ name: 'proforma_consult_result_id' })
  proformaConsultResult?: ProformaConsultResultV2;

  @OneToOne(type => CommonCode)
  @JoinColumn({ name: 'consult_status', referencedColumnName: 'key' })
  consultCodeStatus?: CommonCode;

  admin?: PlatformAdmin;
}
