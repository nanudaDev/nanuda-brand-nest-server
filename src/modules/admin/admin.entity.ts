import { classToPlain } from 'class-transformer';
import { BaseUserEntity } from 'src/core';
import { ADMIN_STATUS, ADMIN_ROLES } from 'src/shared';
import { Column, Entity } from 'typeorm';
import { UserType } from '../auth';

@Entity({ name: 'admin' })
export class Admin extends BaseUserEntity {
  @Column({
    name: 'admin_status',
    type: 'varchar',
    default: ADMIN_STATUS.WAITING,
  })
  adminStatus?: ADMIN_STATUS;

  @Column({
    name: 'user_roles',
    type: 'json',
  })
  userRoles: ADMIN_ROLES[];

  get userType(): UserType {
    return UserType.ADMIN;
  }
}
