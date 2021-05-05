import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/core';
import { SERVICE_STATUS, SITE_IN_CONSTRUCTION } from 'src/shared';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { YN } from 'src/common';

@Entity({ name: 'site_in_service_record_backup' })
export class SiteInServiceRecordBackup extends BaseEntity<
  SiteInServiceRecordBackup
> {
  @Column({
    name: 'description',
    type: 'text',
  })
  description?: string;

  @Column({
    name: 'service_upgrade_reason',
    type: 'varchar',
    default: () => SITE_IN_CONSTRUCTION.SERVICE_UPDATE,
  })
  serviceUpgradeReason: SITE_IN_CONSTRUCTION;

  @Column({
    type: 'varchar',
  })
  status: SERVICE_STATUS;

  @Column({
    name: 'ticket_id',
    type: 'int',
  })
  ticketId?: number;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId: number;

  @Column({
    name: 'ready_to_run_yn',
    type: 'char',
    default: () => YN.NO,
  })
  readyToRun?: YN;

  admin?: PlatformAdmin;
}
