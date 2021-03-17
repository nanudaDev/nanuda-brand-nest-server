import { BaseEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'faq_answer' })
export class Faq extends BaseEntity<Faq> {
  @Column({
    type: 'text',
    nullable: false,
  })
  faq: string;

  @Column({
    name: 'faq_parent_id',
    type: 'int',
    nullable: true,
  })
  faqParentId: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  answer: string;

  @Column({
    type: 'int',
  })
  order?: number;
}
