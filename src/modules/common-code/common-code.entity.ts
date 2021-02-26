import { BaseEntity } from 'src/core';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'common-code' })
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
}
