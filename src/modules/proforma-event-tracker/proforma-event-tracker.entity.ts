import { BaseMapperEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { ConsultResultV2 } from '../consult-result-v2/consult-result-v2.entity';

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

  @OneToOne(type => ConsultResultV2)
  @JoinColumn({
    name: 'proforma_consult_id',
    referencedColumnName: 'proformaConsultResultId',
  })
  consult?: ConsultResultV2;

  @OneToOne(type => ProformaConsultResultV2)
  @JoinColumn({ name: 'proforma_consult_id' })
  proformaConsult?: ProformaConsultResultV2;
}
