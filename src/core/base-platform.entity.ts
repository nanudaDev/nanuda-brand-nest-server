import {
  BaseEntity as TyepOrmBaseEntity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseDto } from './';

export class BasePlatformEntity<Entity> extends TyepOrmBaseEntity {
  constructor(partial?: Partial<Entity>) {
    super();
    partial &&
      Object.keys(partial).map(key => {
        //   changed primary key column from no to id
        // if (key !== 'id' && this.hasOwnProperty(key)) {
        if (key !== 'id' && partial[key] !== undefined) {
          this[key] = partial[key];
        }
      });
  }

  set(partial: Object, deep: boolean = false): this {
    partial &&
      Object.keys(partial).map(key => {
        // if (key !== 'id' && this.hasOwnProperty(key)) {
        if (partial[key] !== undefined) {
          if (deep) {
            this[key] = partial[key];
          } else {
            if (!(partial[key] instanceof BaseDto)) {
              this[key] = partial[key];
            }
          }
        }
        // }
      });
    return this;
  }

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'no',
  })
  no: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;
}
