import { BaseEntity } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'result_response' })
export class ResultResponse extends BaseEntity<ResultResponse> {
  @Column({
    type: 'text',
  })
  response: string;

  @Column({
    name: 'response_code',
    type: 'varchar',
  })
  responseCode: string;

  @Column({
    name: 'fnb_owner_status',
    type: 'varchar',
  })
  fnbOwnerStatus: FNB_OWNER;
}
