import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ORDER_BY_VALUE, YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { FNB_OWNER } from 'src/shared';
import { EntityManager, Repository } from 'typeorm';
import { AggregateResultResponseService } from '../aggregate-result-response/aggregate-result-resource.service';
import { CommonCode } from '../common-code/common-code.entity';
import { LocationAnalysisService } from '../data/location-analysis/location-analysis.service';
import { AdminResultResponseCreateDto, ResultResponseListDto } from './dto';
import { ResultResponseBackup } from './result-response-backup.entity';
import { ResultResponse } from './result-response.entity';

@Injectable()
export class ResultResponseService extends BaseService {
  constructor(
    @InjectRepository(ResultResponse)
    private readonly resultResponseRepo: Repository<ResultResponse>,
    @InjectRepository(ResultResponseBackup)
    private readonly responseBackupRepo: Repository<ResultResponseBackup>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly aggregateResponseService: AggregateResultResponseService,
    private readonly locationAnalysisSergice: LocationAnalysisService,
  ) {
    super();
  }

  /**
   * create for admin
   * @param adminResultResponseCreateDto
   */
  async createForAdmin(
    adminResultResponseCreateDto: AdminResultResponseCreateDto,
  ): Promise<ResultResponse> {
    const responseCode = `${adminResultResponseCreateDto.ageGroup}_${adminResultResponseCreateDto.expGroup}_${adminResultResponseCreateDto.skillGroup}_${adminResultResponseCreateDto.howSkillGroup}_${adminResultResponseCreateDto.revenueRange}`;
    let newResponse = new ResultResponse(adminResultResponseCreateDto);
    newResponse.responseCode = responseCode;
    newResponse = await this.resultResponseRepo.save(newResponse);
    return newResponse;
  }

  /**
   * return response
   * @param resultResponseListDto
   */
  async findResponse(
    resultResponseListDto: ResultResponseListDto,
  ): Promise<ResultResponse> {
    const response = await this.resultResponseRepo
      .createQueryBuilder('response')
      .where('response.responseCode = :responseCode', {
        responseCode: resultResponseListDto.responseCode,
      })
      .andWhere('response.fnbOwnerStatus = :fnbownerStatus', {
        fnbOwnerStatus: resultResponseListDto.fnbOwnerStatus,
      })
      .getOne();

    if (!response) {
      throw new BrandAiException('response.notFound');
    }

    return response;
  }

  /**
   * TRANSFER
   */
  //   @Cron('*/2 * * * * *')
  async transferToProductionFile() {
    const backupTransfer = await this.entityManager.transaction(
      async entityManager => {
        const backup = await this.responseBackupRepo
          .createQueryBuilder('backup')
          .where('backup.isTransferredYn = :transfer', { transfer: YN.NO })
          .orderBy('backup.id', ORDER_BY_VALUE.ASC)
          .limit(1)
          .getOne();

        if (!backup) {
          return;
        }
        let newResponse = new ResultResponse(backup);
        // age group code
        const ageCode = await entityManager
          .getRepository(CommonCode)
          .findOne({ where: { additionalDisplayValue: newResponse.ageGroup } });
        newResponse.ageGroup = ageCode.key;
        // exp group
        const expGroup = await entityManager
          .getRepository(CommonCode)
          .findOne({ where: { additionalDisplayValue: newResponse.expGroup } });
        newResponse.expGroup = expGroup.key;
        // skill group
        const skillGroup = await entityManager
          .getRepository(CommonCode)
          .findOne({
            where: { additionalDisplayValue: newResponse.skillGroup },
          });
        newResponse.skillGroup = skillGroup.key;
        // how skill group
        if (newResponse.howSkillGroup) {
          const howSkillGroup = await entityManager
            .getRepository(CommonCode)
            .findOne({
              where: { additionalDisplayValue: newResponse.howSkillGroup },
            });
          newResponse.howSkillGroup = howSkillGroup.key;
        }
        // how operate group
        if (newResponse.howOperateGroup) {
          const howOperateGroup = await entityManager
            .getRepository(CommonCode)
            .findOne({
              where: { additionalDisplayValue: newResponse.howOperateGroup },
            });
          newResponse.howOperateGroup = howOperateGroup.key;
        }
        // tentative open group
        if (
          newResponse.fnbOwnerStatus === FNB_OWNER.NEW_FNB_OWNER &&
          newResponse.tentativeOpenGroup
        ) {
          const tentativeOpenGroup = await entityManager
            .getRepository(CommonCode)
            .findOne({
              where: { additionalDisplayValue: newResponse.tentativeOpenGroup },
            });
          newResponse.tentativeOpenGroup = tentativeOpenGroup.key;
        }
        // revenue group
        if (
          newResponse.fnbOwnerStatus === FNB_OWNER.CUR_FNB_OWNER &&
          newResponse.revenueRange
        ) {
          const revenueRange = await entityManager
            .getRepository(CommonCode)
            .findOne({
              where: { additionalDisplayValue: newResponse.revenueRange },
            });
          newResponse.revenueRange = revenueRange.key;
        }
        newResponse.response = newResponse.response.replace(
          '"중분류"',
          'MEDIUM_CODE',
        );
        newResponse.response = newResponse.response.replace(
          '"소분류"',
          'SMALL_CODE',
        );
        const optionalValues =
          `${
            newResponse.howSkillGroup ? `_${newResponse.howSkillGroup}` : ''
          }` +
          `${
            newResponse.howOperateGroup ? `_${newResponse.howOperateGroup}` : ''
          }` +
          `${
            newResponse.tentativeOpenGroup
              ? `_${newResponse.tentativeOpenGroup}`
              : ''
          }` +
          `${newResponse.revenueRange ? `_${newResponse.revenueRange}` : ''}`;
        newResponse.responseCode =
          `${newResponse.fnbOwnerStatus}_${newResponse.ageGroup}_${newResponse.expGroup}_${newResponse.skillGroup}` +
          optionalValues;
        // save new response
        newResponse = await entityManager.save(newResponse);
        console.log(
          `Inserted response id:${newResponse.id} into table and code conversion successful.`,
        );
        // transferred
        backup.isTransferredYn = YN.YES;
        await entityManager.save(backup);
      },
    );
  }
}
