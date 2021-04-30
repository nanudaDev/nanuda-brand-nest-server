import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, BrandAiException } from 'src/core';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AdminPopupCreateDto } from './dto';
import { Popup } from './popup.entity';

@Injectable()
export class PopupService extends BaseService {
  constructor(
    @InjectRepository(Popup) private readonly popupRepo: Repository<Popup>,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * create new popup for admin
   * @param adminId
   * @param adminPopupCreateDto
   * @returns
   */
  async createForAdmin(
    adminId: number,
    adminPopupCreateDto: AdminPopupCreateDto,
  ): Promise<Popup> {
    let newPopup = new Popup(adminPopupCreateDto);
    newPopup.adminId = adminId;
    if (adminPopupCreateDto.images && adminPopupCreateDto.images.length > 0) {
      adminPopupCreateDto.images = await this.fileUploadService.moveS3File(
        adminPopupCreateDto.images,
      );
      if (!adminPopupCreateDto.images) {
        throw new BrandAiException('popup.imageUploadFailed');
      }
    }
    newPopup = await this.popupRepo.save(newPopup);
    return newPopup;
  }
}
