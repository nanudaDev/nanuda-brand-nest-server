/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  BaseEntity as TyepOrmBaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseDto } from './';

export class BaseEntity<Entity> extends TyepOrmBaseEntity {
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

  set(partial: Record<string, any>, deep: boolean = false): this {
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

  setNew(partial: any, deep: boolean = false): this {
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
    delete this.id;
    return this;
  }

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @CreateDateColumn({
    name: 'created',
    type: 'datetime',
    default: new Date(),
  })
  created?: Date;

  @UpdateDateColumn({
    name: 'updated',
    type: 'datetime',
  })
  updated?: Date;
}
