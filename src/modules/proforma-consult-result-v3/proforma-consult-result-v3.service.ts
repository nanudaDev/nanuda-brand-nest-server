import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../core/base.service';
import { ProformaConsultResultV3 } from './proforma-consult-result-v3.entity';
import { Repository, EntityManager } from 'typeorm';
import { ProformaConsultResultV3CreateDto } from './dto/proforma-consult-result-v3-create.dto';
import { ProformaEventTrackerService } from '../proforma-event-tracker/proforma-event-tracker.service';
import { AdminConsultResultV3CreateDto } from '../consult-result-v3/dto/admin-consult-result-v3-create.dto';
import { YN } from 'src/common';

@Injectable()
export class ProformaConsultResultV3Service extends BaseService {
  constructor(
    @InjectRepository(ProformaConsultResultV3)
    private readonly proformaV3Repo: Repository<ProformaConsultResultV3>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly proformaTrackerService: ProformaEventTrackerService,
  ) {
    super();
  }

  /**
   * create new proforma for landing page
   * @param proformaConsultResultV3CreateDto
   * @returns
   */
  async createProforma(
    proformaConsultResultV3CreateDto:
      | ProformaConsultResultV3CreateDto
      | AdminConsultResultV3CreateDto,
    adminId?: number,
  ): Promise<ProformaConsultResultV3> {
    const proforma = await this.entityManager.transaction(
      async entityManager => {
        let proforma = new ProformaConsultResultV3(
          proformaConsultResultV3CreateDto,
        );
        if (
          proformaConsultResultV3CreateDto instanceof
          AdminConsultResultV3CreateDto
        ) {
          proforma.isAdminYn = YN.YES;
          proforma.adminId = adminId;
          proforma.isConsultYn = YN.YES;
        }
        proforma = await entityManager.save(proforma);
        //   create new tracker
        this.proformaTrackerService.createRecord(proforma);
        return proforma;
      },
    );
    return proforma;
  }
}
