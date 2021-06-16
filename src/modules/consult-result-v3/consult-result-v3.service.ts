import { Injectable } from '@nestjs/common';
import { BaseDto } from '../../core/base.dto';
import { ConsultResultV3 } from './consult-result-v3.entity';
import { BaseService } from '../../core/base.service';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ConsultResultV3CreateDto } from './dto/consult-result-v3-create.dto';
import { Request } from 'express';
import { ProformaConsultResultV3 } from '../proforma-consult-result-v3/proforma-consult-result-v3.entity';
import { BrandAiException } from '../../core/errors/brand-ai.exception';
import { SmsNotificationService } from '../sms-notification/sms-notification.service';
import { PickcookSlackNotificationService } from '../../common/utils/service/pickcook-slack-notification.service';
import { YN } from 'src/common';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { AdminConsultResultV3ListDto } from './dto/admin-consult-result-v3-list.dto';
import { AdminConsultResultV3UpdateDto } from './dto/admin-consult-result-v3-update.dto';
import { RandomConsultCountTracker } from '../random-consult-count-tracker/random-consult-count-tracker.entity';
import { ConsultResult } from '../consult-result/consult-result.entity';
import { ConsultResultV2 } from '../consult-result-v2/consult-result-v2.entity';
import { BRAND_CONSULT } from '../../shared/common-code.type';
import { ProformaConsultResultV3Service } from '../proforma-consult-result-v3/proforma-consult-result-v3.service';
import { AdminConsultResultV3CreateDto } from './dto/admin-consult-result-v3-create.dto';
import { ConsultResultV3MessageLogService } from '../consult-result-v3-message-log/consult-result-v3-message-log.service';
import { AdminConsultResultV3SendMessageDto } from './dto/admin-consult-result-v3-send-message.dto';
import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../common/interfaces/pagination.type';

@Injectable()
export class ConsultResultV3Service extends BaseService {
  constructor(
    @InjectRepository(ConsultResultV3)
    private readonly consultRepo: Repository<ConsultResultV3>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly smsNotificationService: SmsNotificationService,
    private readonly slackNotificationService: PickcookSlackNotificationService,
    @InjectRepository(PlatformAdmin, 'platform')
    private readonly platformAdminRepo: Repository<PlatformAdmin>,
    @InjectRepository(RandomConsultCountTracker)
    private readonly randomConsultCounTrackerRepo: Repository<
      RandomConsultCountTracker
    >,
    private readonly proformaConsultService: ProformaConsultResultV3Service,
    private readonly messageLogService: ConsultResultV3MessageLogService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminConsultResultV3ListDto
   * @param pagination
   * @returns
   */
  async findAllForAdmin(
    adminConsultResultV3ListDto: AdminConsultResultV3ListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResultV3>> {
    const qb = this.consultRepo
      .createQueryBuilder('consult')
      .CustomInnerJoinAndSelect([
        'fnbOwnerCodeStatus',
        'consultCodeStatus',
        'proformaConsultResult',
      ])
      .AndWhereLike(
        'consult',
        'name',
        adminConsultResultV3ListDto.name,
        adminConsultResultV3ListDto.exclude('name'),
      )
      .AndWhereLike(
        'consult',
        'phone',
        adminConsultResultV3ListDto.phone,
        adminConsultResultV3ListDto.exclude('phone'),
      )
      .AndWhereLike(
        'consult',
        'fnbOwnerStatus',
        adminConsultResultV3ListDto.fnbOwnerStatus,
        adminConsultResultV3ListDto.exclude('fnbOwnerStatus'),
      )
      .AndWhereLike(
        'consult',
        'consultStatus',
        adminConsultResultV3ListDto.consultStatus,
        adminConsultResultV3ListDto.exclude('consultStatus'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminConsultResultV3ListDto)
      .getManyAndCount();

    const [items, totalCount] = await qb;

    await Promise.all(
      items.map(async item => {
        if (item.adminId) {
          item.admin = await this.platformAdminRepo.findOne(item.adminId);
        }
      }),
    );

    return { items, totalCount };
  }

  /**
   * update for admin
   * @param id
   * @param adminConsultResultV3UpdateDto
   * @returns
   */
  async updateForAdmin(
    id: number,
    adminConsultResultV3UpdateDto: AdminConsultResultV3UpdateDto,
  ): Promise<ConsultResultV3> {
    let consult = await this.consultRepo.findOne(id);
    if (!consult) throw new BrandAiException('consultResult.notFound');
    consult = consult.set(adminConsultResultV3UpdateDto);
    if (consult.consultStatus === BRAND_CONSULT.CONSULT_CONTRACTED) {
      consult.consultCompleteDate = new Date();
    }
    if (consult.consultStatus === BRAND_CONSULT.CONSULT_DROPPED) {
      consult.consultDropDate = new Date();
    }
    console.log(consult);
    consult = await this.consultRepo.save(consult);
    return consult;
  }

  /**
   * find one for admin
   * @param id
   * @returns
   */
  async findOneForAdmin(id: number): Promise<ConsultResultV3> {
    const consult = await this.consultRepo
      .createQueryBuilder('consult')
      .CustomInnerJoinAndSelect([
        'fnbOwnerCodeStatus',
        'consultCodeStatus',
        'proformaConsultResult',
      ])
      .CustomLeftJoinAndSelect(['messages'])
      .where('consult.id = :id', { id: id })
      .getOne();
    if (!consult) {
      throw new BrandAiException('consultResult.notFound');
    }
    if (consult && consult.adminId) {
      consult.admin = await this.platformAdminRepo.findOne(consult.adminId);
    }

    return consult;
  }

  /**
   * assign myself admin
   * @param id
   * @param adminId
   * @returns
   */
  async assignMyself(id: number, adminId: number): Promise<ConsultResultV3> {
    let consult = await this.consultRepo.findOne(id);
    if (!consult) throw new BrandAiException('consultResult.notFound');
    consult.adminId = adminId;
    consult = await this.consultRepo.save(consult);
    return consult;
  }

  /**
   * create consult for pickcook user
   * @param consultResultCreateDto
   * @param req
   * @returns
   */
  async createConsult(
    consultResultCreateDto: ConsultResultV3CreateDto,
    req: Request,
  ): Promise<ConsultResultV3> {
    const consult = await this.entityManager.transaction(
      async entityManager => {
        const checkConsult = await this.consultRepo.findOne({
          proformaConsultResultId:
            consultResultCreateDto.proformaConsultResultId,
        });
        if (checkConsult)
          throw new BrandAiException('consultResult.proformaExist');
        let proforma = await entityManager
          .getRepository(ProformaConsultResultV3)
          .findOne(consultResultCreateDto.proformaConsultResultId);
        if (!proforma) throw new BrandAiException('proforma.notFound');
        let consult = new ConsultResultV3(consultResultCreateDto);
        consult.fnbOwnerStatus = proforma.fnbOwnerStatus;
        //   await send sms notification
        this.smsNotificationService.sendConsultNotificationV2(consult, req);
        // send slack notification
        this.slackNotificationService.sendAdminConsultNoticationV2(consult);
        consult = await entityManager.save(consult);
        proforma.isConsultYn = YN.YES;
        proforma = await entityManager.save(proforma);
        return consult;
      },
    );
    return consult;
  }

  /**
   * get consult count randomized
   * @returns
   */
  async getConsultCount(): Promise<number> {
    const randomCount = await this.randomConsultCounTrackerRepo.findOne({
      isUsedYn: YN.YES,
    });
    const consult1Count = await this.entityManager
      .getRepository(ConsultResult)
      .find();
    const consult2Count = await this.entityManager
      .getRepository(ConsultResultV2)
      .find();
    const consult3Count = await this.entityManager
      .getRepository(ConsultResultV3)
      .find();

    return (
      randomCount.value +
      consult1Count.length +
      consult2Count.length +
      consult3Count.length
    );
  }

  /**
   * create for admin
   * @param adminConsultResultV3CreateDto
   * @param adminId
   * @returns
   */
  async createForAdmin(
    adminConsultResultV3CreateDto: AdminConsultResultV3CreateDto,
    adminId: number,
  ): Promise<ConsultResultV3> {
    const proforma = await this.proformaConsultService.createProforma(
      adminConsultResultV3CreateDto,
      adminId,
    );
    if (!proforma) throw new BrandAiException('proforma.failedCreate');
    let newConsult = new ConsultResultV3(adminConsultResultV3CreateDto);
    // proforma id, admin id
    newConsult.proformaConsultResultId = proforma.id;
    newConsult.adminId = adminId;
    newConsult = await this.consultRepo.save(newConsult);

    return newConsult;
  }

  /**
   * send message
   * @param id
   * @param adminId
   * @param messageDto
   * @param req
   * @returns
   */
  async sendMessageForAdmin(
    id: number,
    adminId: number,
    messageDto: AdminConsultResultV3SendMessageDto,
    req: Request,
  ): Promise<ConsultResultV3> {
    const consult = await this.findOneForAdmin(id);
    const sendMessage = await this.entityManager.transaction(
      async entityManager => {
        // 문자 보낸다
        await this.smsNotificationService.sendMessageConsultResultV3(
          consult,
          messageDto.message,
          req,
        );
        consult.isMessageSentYn = YN.YES;
        await entityManager.save(consult);
        // 기록 남긴다
        this.messageLogService.createLog(
          consult.id,
          adminId,
          messageDto.message,
        );
      },
    );
    return consult;
  }
}
