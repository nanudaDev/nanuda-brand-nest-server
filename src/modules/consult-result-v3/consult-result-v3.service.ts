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

@Injectable()
export class ConsultResultV3Service extends BaseService {
  constructor(
    @InjectRepository(ConsultResultV3)
    private readonly consultRepo: Repository<ConsultResultV3>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly smsNotificationService: SmsNotificationService,
    private readonly slackNotificationService: PickcookSlackNotificationService,
  ) {
    super();
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
}
