import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { ResultResponseListDto } from './dto';
import { ResultResponse } from './result-response.entity';

@Injectable()
export class ResultResponseService extends BaseService {
  constructor(
    @InjectRepository(ResultResponse)
    private readonly resultResponseRepo: Repository<ResultResponse>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
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
}
