import { YN } from 'src/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'code_hdong' })
export class CodeHdong {
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'int',
  })
  id: number;
  @Column({
    type: 'varchar',
  })
  sidoName: string;

  @Column({
    type: 'varchar',
  })
  hdongCode: string;

  @Column({
    type: 'varchar',
  })
  guName: string;

  @Column({
    type: 'varchar',
  })
  hdongName: string;

  @Column({
    type: 'char',
  })
  usable: YN;
}
