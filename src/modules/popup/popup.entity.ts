import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { PICKCOOK_POPUP } from 'src/shared';
import { Column, Entity } from 'typeorm';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'popup' })
export class Popup extends BaseEntity<Popup> {
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    name: 'in_use',
    type: 'char',
    default: () => YN.NO,
  })
  inUse: YN;

  @Column({
    name: 'admin_id',
    type: 'int',
  })
  adminId: number;

  @Column({
    type: 'datetime',
  })
  started?: Date;

  @Column({
    type: 'datetime',
  })
  ended?: Date;

  @Column({
    name: 'popup_type',
    type: 'varchar',
    default: () => PICKCOOK_POPUP.REG_SERVICE_UPDATE,
  })
  popupType?: PICKCOOK_POPUP;

  @Column({
    type: 'json',
  })
  images?: FileAttachmentDto[];

  admin?: PlatformAdmin;
}
