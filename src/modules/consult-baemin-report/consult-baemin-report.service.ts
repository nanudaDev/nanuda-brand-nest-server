import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base.service';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { ConsultBaeminReport } from './consult-baemin-report.entity';
import { Repository, EntityManager } from 'typeorm';
import { AdminConsultBaeminReportCreateDto } from './dto/admin-consult-baemin-report-create.dto';
import { ConsultResultV3 } from '../consult-result-v3/consult-result-v3.entity';
import { BrandAiException } from '../../core/errors/brand-ai.exception';
import { AdminConsultBaeminReportUpdateDto } from './dto/admin-consult-baemin-report-update.dto';

@Injectable()
export class ConsultBaeminReportService extends BaseService {
  constructor(
    @InjectRepository(ConsultBaeminReport)
    private readonly consultBaeminReportRepo: Repository<ConsultBaeminReport>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create new baemin report
   * @param consultId
   * @param adminConsultBaeminReportCreateDto
   * @returns
   */
  async createReportForAdmin(
    consultId: number,
    adminConsultBaeminReportCreateDto: AdminConsultBaeminReportCreateDto,
  ): Promise<ConsultBaeminReport> {
    const consult = await this.entityManager
      .getRepository(ConsultResultV3)
      .findOne(consultId);
    if (!consult) throw new BrandAiException('consultResult.notFound');
    let newReport = new ConsultBaeminReport(adminConsultBaeminReportCreateDto);
    newReport.consultId = consult.id;
    newReport = await this.consultBaeminReportRepo.save(newReport);

    return newReport;
  }

  /**
   * update report for admin
   * @param id
   * @param adminConsultBaeminReportUpdateDto
   * @returns
   */
  async updateReportForAdmin(
    id: number,
    adminConsultBaeminReportUpdateDto: AdminConsultBaeminReportUpdateDto,
  ): Promise<ConsultBaeminReport> {
    let report = await this.consultBaeminReportRepo.findOne(id);
    if (!report) throw new BrandAiException('consultBaeminReport.notFound');
    report = report.set(adminConsultBaeminReportUpdateDto);
    report = await this.consultBaeminReportRepo.save(report);

    return report;
  }
}
