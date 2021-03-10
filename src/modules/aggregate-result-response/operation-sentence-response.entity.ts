import { BaseEntity } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'operation_sentence_response' })
export class OperationSentenceResponse extends BaseEntity<
  OperationSentenceResponse
> {
  @Column({
    name: 'delivery_restaurant_ratio_grade',
    type: 'int',
  })
  deliveryRatioGrade: number;

  @Column({
    name: 'age_group_grade',
    type: 'int',
  })
  ageGroupGrade: number;

  @Column({
    type: 'text',
  })
  response: string;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;
}
