import { BaseEntity, Column, CreateDateColumn } from 'typeorm';

export class BaseMapperEntity extends BaseEntity {
  @CreateDateColumn({
    name: 'created',
    type: 'datetime',
    default: new Date(),
  })
  created?: Date;
}
