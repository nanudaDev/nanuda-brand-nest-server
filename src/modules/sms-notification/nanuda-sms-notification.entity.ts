import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity, BasePlatformEntity } from 'src/core';
import { UserType } from '../auth';

@Entity({ name: 'SMS_AUTH' })
export class SmsAuth extends BasePlatformEntity<SmsAuth> {
  @Column({
    type: 'varchar',
    name: 'PHONE',
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'int',
    name: 'AUTH_CODE',
    nullable: false,
  })
  authCode: number;

  @Column({
    type: 'varchar',
    name: 'USER_TYPE',
    default: () => UserType.PICKCOOK_USER,
  })
  userType?: UserType;
}
