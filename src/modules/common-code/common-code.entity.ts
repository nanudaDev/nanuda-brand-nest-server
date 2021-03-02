import { BaseEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'common_code' })
export class CommonCode extends BaseEntity<CommonCode> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  key: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  value: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  category: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  comment: string;

  @Column({
    name: 'display_value',
    type: 'varchar',
  })
  displayName: string;
}
