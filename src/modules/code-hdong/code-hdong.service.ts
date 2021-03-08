import { InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CodeHdong } from './code-hdong.entity';

export class CodeHdongService extends BaseService {
  constructor(
    @InjectRepository(CodeHdong, 'wq')
    private readonly codeHdongRepo: Repository<CodeHdong>,
  ) {
    super();
  }

  /**
   * find all sido
   */
  async findAllSido(): Promise<CodeHdong[]> {
    const qb = this.codeHdongRepo
      .createQueryBuilder('codeHdong')
      .where('codeHdong.usable = :usable', { usable: YN.YES })
      .groupBy('sidoName')
      .getMany();

    return await qb;
  }
}
