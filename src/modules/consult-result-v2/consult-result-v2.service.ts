import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { YN } from 'src/common';
import {
  encryptString,
  PickcookSlackNotificationService,
} from 'src/common/utils';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { ProformaConsultResultV2 } from '../proforma-consult-result-v2/proforma-consult-result-v2.entity';
import { SmsNotificationService } from '../sms-notification/sms-notification.service';
import { ConsultResultV2 } from './consult-result-v2.entity';
import { ConsultResultV2CreateDto } from './dto';

@Injectable()
export class ConsultResultVService extends BaseService {
  constructor(
    @InjectRepository(ConsultResultV2)
    private readonly consultResultV2Repo: Repository<ConsultResultV2>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly smsNotificationService: SmsNotificationService,
    private readonly pickcookSlackNotificationService: PickcookSlackNotificationService,
  ) {
    super();
  }

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
