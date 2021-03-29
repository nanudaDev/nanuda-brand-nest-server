import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { PickcookSlackNotificationService } from 'src/common/utils';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
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
      .CustomInnerJoinAndSelect([
        'revenueRangeCodeStatus',
        'fnbOwnerCodeStatus',
        'ageGroupCodeStatus',
        'operationSentenceResponse',
        'consultCodeStatus',
        'proforma',
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
      .AndWhereEqual(
        'consult',
        'deliveryRatioGrade',
        adminConsultResultListDto.deliveryRatioGrade,
        adminConsultResultListDto.exclude('deliveryRatioGrade'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminConsultResultListDto);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param id
   */
  async findOneForAdmin(id: number): Promise<ConsultResult> {
    const qb = await this.consultRepo
      .createQueryBuilder('consult')
      .CustomInnerJoinAndSelect([
        'revenueRangeCodeStatus',
        'fnbOwnerCodeStatus',
        'ageGroupCodeStatus',
        'operationSentenceResponse',
        'consultCodeStatus',
        'proforma',
      ])
      .innerJoinAndSelect('proforma.questions', 'questions')
      .where('consult.id = :id', { id: id })
      .getOne();

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
        newConsult.reservationCode = `PC${consultResultCreateDto.phone}-${newConsult.id}`;
        await entityManager.save(newConsult);
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
