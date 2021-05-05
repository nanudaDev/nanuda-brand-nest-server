import { RESTAURANT_TYPE } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'modified_revenue_tracker' })
export class ModifiedRevenueTracker extends BaseEntity<ModifiedRevenueTracker> {
  @Column({
    type: 'bigint',
  })
  hdongCode: number | string;

  @Column({
    type: 'varchar',
  })
  sSmallCategoryCode: string;

  @Column({
    name: 'restaurant_type',
    type: 'varchar',
  })
  restaurantType: RESTAURANT_TYPE;

  @Column({
    type: 'int',
  })
  revenue: number;
}
