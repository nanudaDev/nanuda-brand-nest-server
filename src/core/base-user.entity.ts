import { Exclude } from 'class-transformer';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseUserEntity extends BaseEntity<BaseUserEntity> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    name: 'phone',
  })
  phone: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'password',
  })
  password: string;

  @Column({
    type: 'datetime',
    name: 'last_login_at',
  })
  lastLoginAt?: Date;
}
