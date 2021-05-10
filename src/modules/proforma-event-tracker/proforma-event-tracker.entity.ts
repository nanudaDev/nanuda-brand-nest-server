import { BaseMapperEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'proforma_event_tracker' })
export class ProformaEventTracker extends BaseMapperEntity<
  ProformaEventTracker
> {
  @Column({
    name: 'ip_address',
    type: 'varchar',
  })
  ipAddress: string;

  @Column({
    name: 'proforma_consult_id',
    type: 'int',
  })
  proformaConsultId: number;
}
