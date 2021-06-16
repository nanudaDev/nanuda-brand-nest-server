import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/core';
import { FNB_OWNER } from '../../shared/common-code.type';
import { YN } from '../../common/interfaces/yn.type';
import { PlatformAdmin } from '../admin/platform-admin.entity';

@Entity({ name: 'proforma_consult_result_v3' })
export class ProformaConsultResultV3 extends BaseEntity<
  ProformaConsultResultV3
> {
  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;

  @Column({
    name: 'ip_address',
    type: 'varchar',
  })
  ipAddress: string;

  @Column({
    name: 'is_consult_yn',
    type: 'char',
    default: YN.NO,
  })
  isConsultYn: YN;

  @Column({
    name: 'is_admin_yn',
    type: 'char',
    default: YN.NO,
  })
  isAdminYn?: YN;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId?: number;

  admin?: PlatformAdmin;
}
