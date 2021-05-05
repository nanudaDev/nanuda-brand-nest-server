import { BaseWqEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'pickcook_attribute_values_delivery' })
export class SScoreAttributeValuesDelivery extends BaseWqEntity<
  SScoreAttributeValuesDelivery
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
    type: 'bigint',
  })
  cookingScore: number;

  @Column({
    type: 'bigint',
  })
  managingScore: number;

  @Column({
    type: 'bigint',
  })
  initialCostScore: number;
}
