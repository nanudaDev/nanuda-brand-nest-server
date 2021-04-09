import { BasePlatformEntity } from 'src/core';
import { ADMIN_USER } from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'ADMIN_USER' })
export class PlatformAdmin extends BasePlatformEntity<PlatformAdmin> {
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
    default: ADMIN_USER.NORMAL,
    name: 'AUTH_CODE',
    length: 10,
  })
  authCode: ADMIN_USER;

  @Column({
    type: 'datetime',
    name: 'LAST_LOGIN_AT',
  })
  lastLoginAt?: Date;
}
