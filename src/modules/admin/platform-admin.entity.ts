import { BasePlatformEntity } from 'src/core';
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
}
