import { BaseWqEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'pickcook_category_group_mapper' })
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
}
