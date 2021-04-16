import { BaseEntity } from 'src/core';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PickcookUser } from '../pickcook-user/pickcook-user.entity';

@Entity({ name: 'consult_result_response' })
export class ConsultResultReport extends BaseEntity<ConsultResultReport> {
  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId: number;

  @Column({
    name: 'pickcook_user_id',
    type: 'int',
  })
  pickcookUserId?: number;

  @ManyToOne(
    type => PickcookUser,
    pickcookUser => pickcookUser.consultResultReports,
  )
  @JoinColumn({ name: 'pickcook_user_id' })
  pickcookUser?: PickcookUser;
}
