import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { RESERVATION_HOURS } from '../../shared';

@Entity({ name: 'reservation' })
export class Reservation extends BaseEntity<Reservation> {
  @Column({
    type: 'varchar',
    name: 'reservation_code',
  })
  reservationCode: string;

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
    name: 'consult_id',
    type: 'int',
  })
  consultId: number;

  @Column({
    name: 'reservation_date',
    type: 'timestamp',
  })
  reservationDate: Date | string;

  @Column({
    name: 'reservation_time',
    type: 'varchar',
  })
  reservationTime: RESERVATION_HOURS;

  @Column({
    name: 'is_cancel_yn',
    type: 'char',
    default: () => YN.NO,
  })
  isCancelYn: YN;

  @Column({
    name: 'delete_reason',
    type: 'text',
  })
  deleteReason: string;

  @OneToOne(type => ConsultResult)
  @JoinColumn({
    name: 'consult_id',
  })
  consultResult?: ConsultResult;

  @Column({
    name: 'format_reservation_date',
    type: 'varchar',
  })
  formatReservationDate: string;

  encryptedReservationCode?: string;
}
