import { BaseWqEntity } from 'src/core';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'pickcook_category_group_mapper' })
@Index('idx_pickcook_category_group_mapper_sSmallCategoryCode', [
  'sSmallCategoryCode',
])
export class PickcookSmallCategoryInfo extends BaseWqEntity<
  PickcookSmallCategoryInfo
> {
  @Column({
    type: 'varchar',
  })
  sSmallCategoryCode: string;

  @Column({
    type: 'text',
  })
  sSmallCategoryName: string;

  @Column({
    type: 'text',
  })
  pkSmallCategoryName: string;

  @Column({
    type: 'text',
  })
  pkMenuName: string;

  @Column({
    type: 'varchar',
  })
  pkMediumCategoryName: string;

  @Column({
    type: 'int',
  })
  isSalesMenu?: number;
}
