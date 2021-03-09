import { BaseEntity } from 'src/core';
import { COMMON_CODE_CATEGORY } from 'src/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'common_code' })
export class CommonCode extends BaseEntity<CommonCode> {
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
  category: COMMON_CODE_CATEGORY | string;

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

  @Column({
    name: 'additional_display_value',
    type: 'varchar',
  })
  additionalDisplayValue: string;
}
