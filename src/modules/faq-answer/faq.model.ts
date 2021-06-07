import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'faq_answer' })
export class Faq extends BaseEntity<Faq> {
  @Field({ nullable: false })
  @Column({
    type: 'text',
    nullable: false,
  })
  faq: string;

  @Field(() => Int)
  @Column({
    name: 'faq_parent_id',
    type: 'int',
    nullable: true,
  })
  faqParentId: number;

  @Field()
  @Column({
    type: 'text',
    nullable: false,
  })
  answer: string;

  @Field(() => Int)
  @Column({
    type: 'int',
  })
  order?: number;
}
