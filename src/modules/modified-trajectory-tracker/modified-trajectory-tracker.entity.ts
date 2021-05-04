import { RESTAURANT_TYPE } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'modified_trajectory_tracker' })
export class ModifiedTrajectoryTracker extends BaseEntity<
  ModifiedTrajectoryTracker
> {
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
  percentage: number;
}
