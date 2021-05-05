import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'hdong_code_no_data' })
export class HdongCodeNoData extends BaseEntity<HdongCodeNoData> {
  @Column({
    name: 'hdong_code',
    type: 'varchar',
  })
  hdongCode: string | number;

  @Column({
    type: 'varchar',
  })
  endpoint: string;

  @Column({
    name: 'is_usable',
    type: 'char',
    default: () => YN.NO,
  })
  isUsable: YN;
}
