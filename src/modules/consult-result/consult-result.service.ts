/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import {
  encryptString,
  PickcookSlackNotificationService,
} from 'src/common/utils';
import { BaseService, BrandAiException } from 'src/core';
import { BRAND_CONSULT } from 'src/shared';
import { EntityManager, Repository } from 'typeorm';
import { PlatformAdmin } from '../admin/platform-admin.entity';
import { CodeHdong } from '../code-hdong/code-hdong.entity';
import { ProformaConsultResult } from '../proforma-consult-result/proforma-consult-result.entity';
import { QuestionGiven } from '../question-given/question-given.entity';
import { QuestionProformaGivenMapper } from '../question-proforma-given-mapper/question-proforma-given-mapper.entity';
import { SmsNotificationService } from '../sms-notification/sms-notification.service';
import { ConsultResult } from './consult-result.entity';
import {
  AdminConsultResultListDto,
  AdminConsultResultUpdateDto,
  ConsultResultResponseCreateDto,
} from './dto';

@Injectable()
export class ConsultResultService extends BaseService {
  constructor(
    @InjectRepository(ConsultResult)
    private readonly consultRepo: Repository<ConsultResult>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(CodeHdong, 'wq')
    private readonly codeHdongRepo: Repository<CodeHdong>,
    @InjectRepository(PlatformAdmin, 'platform')
    private readonly platformAdminRepo: Repository<PlatformAdmin>,
    private readonly smsNotificationService: SmsNotificationService,
    private readonly pickcookSlackNotificationService: PickcookSlackNotificationService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminConsultResultListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminConsultResultListDto: AdminConsultResultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ConsultResult>> {
    const qb = this.consultRepo
      .createQueryBuilder('consult')
      .CustomLeftJoinAndSelect([
        'revenueRangeCodeStatus',
        'fnbOwnerCodeStatus',
        'ageGroupCodeStatus',
        'operationSentenceResponse',
        'consultCodeStatus',
        'proforma',
        'reservation',
      ])
      .innerJoinAndSelect('proforma.questions', 'questions')
      .AndWhereLike(
        'consult',
        'ageGroupCode',
        adminConsultResultListDto.ageGroupCode,
        adminConsultResultListDto.exclude('ageGroupCode'),
      )
      .AndWhereLike(
        'consult',
        'revenueRangeCode',
        adminConsultResultListDto.revenueRangeCode,
        adminConsultResultListDto.exclude('revenueRangeCode'),
      )
      .AndWhereLike(
        'consult',
        'isReadyCode',
        adminConsultResultListDto.isReadyCode,
        adminConsultResultListDto.exclude('isReadyCode'),
      )
      .AndWhereLike(
        'consult',
        'name',
        adminConsultResultListDto.name,
        adminConsultResultListDto.exclude('name'),
      )
      .AndWhereLike(
        'consult',
        'phone',
        adminConsultResultListDto.phone,
        adminConsultResultListDto.exclude('phone'),
      )
      .AndWhereLike(
        'consult',
        'reservationCode',
        adminConsultResultListDto.reservationCode,
        adminConsultResultListDto.exclude('reservationCode'),
      )
      .AndWhereEqual(
        'consult',
        'deliveryRatioGrade',
        adminConsultResultListDto.deliveryRatioGrade,
        adminConsultResultListDto.exclude('deliveryRatioGrade'),
      )
      .AndWhereEqual(
        'consult',
        'adminId',
        adminConsultResultListDto.adminId,
        adminConsultResultListDto.exclude('adminId'),
      )
      .AndWhereLike(
        'reservation',
        'deleteReason',
        adminConsultResultListDto.deleteReason,
        adminConsultResultListDto.exclude('deleteReason'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminConsultResultListDto)
      .getManyAndCount();

    let [items, totalCount] = await qb;

    // get admin for list

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
   * find one for admin
   * @param id
   */
  async findOneForAdmin(id: number): Promise<ConsultResult> {
    const qb = await this.consultRepo
      .createQueryBuilder('consult')
      .CustomLeftJoinAndSelect([
        'revenueRangeCodeStatus',
        'fnbOwnerCodeStatus',
        'ageGroupCodeStatus',
        'operationSentenceResponse',
        'consultCodeStatus',
        'proforma',
        'reservation',
      ])
      .innerJoinAndSelect('proforma.questions', 'questions')
      .where('consult.id = :id', { id: id })
      .getOne();

    if (qb.reservation) {
      qb.reservation.reservationDate = new Date(
        qb.reservation.reservationDate,
      ).toLocaleString();
    }
    await Promise.all(
      qb.proforma.questions.map(async question => {
        const givenIds: number[] = [];
        const answeredGivens = await this.entityManager
          .getRepository(QuestionProformaGivenMapper)
          .find({
            where: {
              proformaConsultResultId: qb.proformaConsultResultId,
              questionId: question.id,
            },
          });
        answeredGivens.map(given => {
          givenIds.push(given.givenId);
        });
        const answers = await this.entityManager
          .getRepository(QuestionGiven)
          .createQueryBuilder('given')
          .CustomInnerJoinAndSelect(['givenDetails'])
          .whereInIds(givenIds)
          .getMany();
        question.givens = answers;
      }),
    );
    if (qb.adminId) {
      qb.admin = await this.platformAdminRepo.findOne(qb.adminId);
    }
    return qb;
  }

  /**
   * update for admin
   * @param id
   * @param adminConsultResultUpdateDto
   */
  async updateForAdmin(
    id: number,
    adminConsultResultUpdateDto: AdminConsultResultUpdateDto,
  ): Promise<ConsultResult> {
    let result = await this.consultRepo.findOne(id);
    result = result.set(adminConsultResultUpdateDto);
    // complete date
    if (
      adminConsultResultUpdateDto.consultStatus ===
      BRAND_CONSULT.CONSULT_COMPLETE
    ) {
      result.consultCompleteDate = new Date();
    }
    // consult drop date
    if (
      adminConsultResultUpdateDto.consultStatus ===
      BRAND_CONSULT.CONSULT_DROPPED
    ) {
      result.consultDropDate = new Date();
    }
    result = await this.consultRepo.save(result);
    return result;
  }

  /**
   * create for user
   * @param consultResultCreateDto
   */
  async createForUser(
    consultResultCreateDto: ConsultResultResponseCreateDto,
    req: Request,
  ): Promise<ConsultResult> {
    // await this.smsNotificationService.checkCode(
    //   consultResultCreateDto.phone,
    //   consultResultCreateDto.smsAuthCode,
    // );
    if (
      consultResultCreateDto.phone &&
      consultResultCreateDto.phone.includes('-')
    ) {
      consultResultCreateDto.phone = consultResultCreateDto.phone.replace(
        /-/g,
        '',
      );
    }
    const consult = await this.entityManager.transaction(
      async entityManager => {
        // find phone and sms auth code first
        const proforma = await entityManager
          .getRepository(ProformaConsultResult)
          .findOne(consultResultCreateDto.proformaConsultResultId);
        if (!proforma) {
          throw new BrandAiException('proforma.notFound');
        }
        let newConsult = new ConsultResult();
        newConsult = newConsult.setNew(proforma);
        newConsult.name = consultResultCreateDto.name;
        newConsult.phone = consultResultCreateDto.phone;
        newConsult.proformaConsultResultId = proforma.id;
        newConsult = await entityManager.save(newConsult);
        const lastFourPhoneDigits = consultResultCreateDto.phone.substr(
          consultResultCreateDto.phone.length - 4,
        );
        const randomCode = Math.floor(1000000 + Math.random() * 9000000);
        newConsult.reservationCode = `PC${lastFourPhoneDigits}-${newConsult.id}-${randomCode}`;
        await entityManager.save(newConsult);
        newConsult.reservationCode = encryptString(newConsult.reservationCode);
        await this.smsNotificationService.sendConsultNotification(
          newConsult,
          req,
        );
        // send slack notification
        await this.pickcookSlackNotificationService.sendAdminConsultNotication(
          newConsult,
        );
        return newConsult;
      },
    );
    return consult;
  }
}
