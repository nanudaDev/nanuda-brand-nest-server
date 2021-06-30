import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseMapperEntity } from '../../core/base-mapper.entity';
import { ConsultResultV3 } from '../consult-result-v3/consult-result-v3.entity';
@Entity({ name: 'consult_result_v3_message_log' })
export class ConsultResultV3MessageLog extends BaseMapperEntity<
  ConsultResultV3MessageLog
> {
  @Column({
    type: 'text',
    nullable: false,
  })
  message: string;

  @Column({
    name: 'consult_result_id',
    type: 'int',
    nullable: false,
  })
  consultResultId: number;

  @Column({
    name: 'admin_id',
    type: 'int',
    nullable: false,
  })
  adminId: number;

  @ManyToOne(
    type => ConsultResultV3,
    consult => consult.messages,
  )
  @JoinColumn({ name: 'consult_result_id' })
  consult?: ConsultResultV3;
}
