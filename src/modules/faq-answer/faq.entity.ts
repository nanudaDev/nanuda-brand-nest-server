import { BaseEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'faq_answer' })
export class Faq extends BaseEntity<Faq> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  faq: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  faq_parent_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  answer: string;
}
