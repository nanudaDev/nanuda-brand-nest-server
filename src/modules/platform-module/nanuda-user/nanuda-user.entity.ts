import { YN } from 'src/common';
import { BasePlatformEntity } from 'src/core';
import { GENDER } from 'src/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'NANUDA_USER' })
export class NanudaUser {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
    name: 'PHONE',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'NAME',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: YN.NO,
    name: 'DEL_YN',
  })
  delYN: YN;
  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.NO,
    name: 'INFO_YN',
  })
  infoYn?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.YES,
    name: 'SERVICE_YN',
  })
  serviceYn?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.NO,
    name: 'MARKET_YN',
  })
  marketYn?: string;

  // What is this column for???
  @Column({
    type: 'int',
    nullable: true,
    name: 'REMAIN_VISIT_COUNT',
    default: 1,
  })
  remainVisitCount?: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'LAST_LOGIN_AT',
  })
  lastLoginAt?: Date;

  @Column({
    type: 'char',
    nullable: true,
    name: 'GENDER',
  })
  gender?: GENDER;
}
