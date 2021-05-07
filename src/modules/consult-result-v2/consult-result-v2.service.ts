import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import {
  encryptString,
  PickcookSlackNotificationService,
} from 'src/common/utils';
import { BaseService, BrandAiException } from 'src/core';
import { BRAND_CONSULT } from 'src/shared';
import { EntityManager, Repository } from 'typeorm';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { SmsNotificationService } from '../sms-notification/sms-notification.service';
import { ConsultResultV2 } from './consult-result-v2.entity';
import {
  AdminConsultResultV2ListDto,
  AdminConsultResultV2UpdateDto,
  ConsultResultV2CreateDto,
} from './dto';

@Injectable()
export class ConsultResultV2Service extends BaseService {
  constructor(
    @InjectRepository(ConsultResultV2)
    private readonly consultResultV2Repo: Repository<ConsultResultV2>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(PlatformAdmin, 'platform')
    private readonly platformAdminRepo: Repository<PlatformAdmin>,
    private readonly smsNotificationService: SmsNotificationService,
    private readonly pickcookSlackNotificationService: PickcookSlackNotificationService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminConsultResultV2ListDto
   * @param pagination
   * @returns
   */
  async findAllForAdmin(
    adminConsultResultV2ListDto: AdminConsultResultV2ListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResultV2>> {
    const qb = this.consultResultV2Repo
      .createQueryBuilder('consult')
      .CustomLeftJoinAndSelect(['fnbOwnerCodeStatus', 'proformaConsultResult'])
      .AndWhereLike(
        'consult',
        'name',
        adminConsultResultV2ListDto.name,
        adminConsultResultV2ListDto.exclude('name'),
      )
      .AndWhereLike(
        'consult',
        'phone',
        adminConsultResultV2ListDto.phone,
        adminConsultResultV2ListDto.exclude('phone'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminConsultResultV2ListDto)
      .getManyAndCount();

    const [items, totalCount] = await qb;

    items.map(async item => {
      if (item.adminId) {
        item.admin = await this.platformAdminRepo.findOne(item.adminId);
      }
    });

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  async findOneForAdmin(id: number): Promise<ConsultResultV2> {
    const qb = await this.consultResultV2Repo
      .createQueryBuilder('consult')
      .CustomLeftJoinAndSelect(['fnbOwnerCodeStatus', 'proformaConsultResult'])
      .where('consult.id = :id', { id: id })
      .getOne();

    if (!qb) throw new BrandAiException('consultResult.notFound');
    if (qb.adminId) {
      qb.admin = await this.platformAdminRepo.findOne(qb.adminId);
    }
    return qb;
  }

  /**
   * update for admi
   * @param id
   * @param adminConsultResultV2UpdateDto
   * @returns
   */
  async updateForAdmin(
    id: number,
    adminConsultResultV2UpdateDto: AdminConsultResultV2UpdateDto,
  ): Promise<ConsultResultV2> {
    let result = await this.consultResultV2Repo.findOne(id);
    result = result.set(adminConsultResultV2UpdateDto);
    // complete date
    if (
      adminConsultResultV2UpdateDto.consultStatus ===
      BRAND_CONSULT.CONSULT_COMPLETE
    ) {
      result.consultCompleteDate = new Date();
    }
    // consult drop date
    if (
      adminConsultResultV2UpdateDto.consultStatus ===
      BRAND_CONSULT.CONSULT_DROPPED
    ) {
      result.consultDropDate = new Date();
    }
    result = await this.consultResultV2Repo.save(result);
    return result;
  }

  /**
   * assign admin
   * @param adminId
   * @param consultId
   */
  async assignAdmin(
    adminId: number,
    consultId: number,
  ): Promise<ConsultResultV2> {
    let consult = await this.consultResultV2Repo.findOne(consultId);
    if (!consult) {
      throw new BrandAiException('consultResult.notFound');
    }
    consult.adminId = adminId;
    consult = await this.consultResultV2Repo.save(consult);
    return consult;
  }

  /**
   * create for pickcook user
   * @param consultResultV2CreateDto
   * @param req
   * @returns
   */
  async createForUser(
    consultResultV2CreateDto: ConsultResultV2CreateDto,
    req?: Request,
  ): Promise<ConsultResultV2> {
    if (
      consultResultV2CreateDto.phone &&
      consultResultV2CreateDto.phone.includes('-')
    ) {
      consultResultV2CreateDto.phone = consultResultV2CreateDto.phone.replace(
        /-/g,
        '',
      );
    }
    const consult = await this.entityManager.transaction(
      async entityManager => {
        const proforma = await entityManager
          .getRepository(ProformaConsultResultV2)
          .findOne(consultResultV2CreateDto.proformaConsultResultId);
        if (!proforma) throw new BrandAiException('proforma.notFound');
        let newConsult = new ConsultResultV2(consultResultV2CreateDto);
        newConsult.proformaConsultResultId = proforma.id;
        newConsult = await entityManager.save(newConsult);
        const lastFourPhoneDigits = consultResultV2CreateDto.phone.substr(
          consultResultV2CreateDto.phone.length - 4,
        );
        const randomCode = Math.floor(1000000 + Math.random() * 9000000);
        newConsult.reservationCode = `PC${lastFourPhoneDigits}-${newConsult.id}-${randomCode}`;
        await entityManager.save(newConsult);
        newConsult.reservationCode = encryptString(newConsult.reservationCode);
        // save reservation code
        await entityManager.save(newConsult);
        // send sms notification
        await this.smsNotificationService.sendConsultNotificationV2(
          newConsult,
          req,
        );
        await this.pickcookSlackNotificationService.sendAdminConsultNoticationV2(
          newConsult,
        );
        // set to true
        proforma.isConsultYn = YN.YES;
        await entityManager.save(proforma);

        return newConsult;
      },
    );
    return consult;
  }
}
