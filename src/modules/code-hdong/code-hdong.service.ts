import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_BY_VALUE, YN } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongListDto } from './dto';

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

  /**
   * find all
   * @param codeHdongListDto
   */
  async findAllGuNames(
    codeHdongListDto: CodeHdongListDto,
  ): Promise<CodeHdong[]> {
    const qb = this.codeHdongRepo
      .createQueryBuilder('codeHdong')
      //   .AndWhereLike(
      //     'codeHdong',
      //     'guName',
      //     codeHdongListDto.guName,
      //     codeHdongListDto.exclude('guName'),
      //   )
      .where('codeHdong.guName IS NOT NULL')
      .andWhere('codeHdong.hdongName IS NOT NULL')
      .andWhere('codeHdong.sidoName = :sidoName', {
        sidoName: codeHdongListDto.sidoName,
      })
      .AndWhereLike(
        'codeHdong',
        'sidoName',
        codeHdongListDto.sidoName,
        codeHdongListDto.exclude('sidoName'),
      )
      .groupBy('codeHdong.guName')
      .orderBy('codeHdong.guName', ORDER_BY_VALUE.ASC)
      .getMany();

    return qb;
  }

  /**
   * find all
   * @param codeHdongListDto
   */
  // 일단 개포 1동 제거
  async findAllDongs(codeHdongListDto: CodeHdongListDto): Promise<CodeHdong[]> {
    const qb = this.codeHdongRepo
      .createQueryBuilder('codeHdong')
      .where('codeHdong.guName IS NOT NULL')
      .andWhere('codeHdong.hdongName IS NOT NULL')
      .andWhere('codeHdong.sidoName = :sidoName', {
        sidoName: codeHdongListDto.sidoName,
      })
      // TODO: 테이블 생성
      // create table
      .andWhere('codeHdong.hdongCode != 1168066000')
      .andWhere('codeHdong.hdongCode != 1174069000')
      .AndWhereLike(
        'codeHdong',
        'guName',
        codeHdongListDto.guName,
        codeHdongListDto.exclude('guName'),
      )
      .groupBy('codeHdong.hdongName')
      .orderBy('codeHdong.hdongName', ORDER_BY_VALUE.ASC)
      .getMany();

    return qb;
  }

  /**
   * find one
   * @param hdongCode
   */
  async findOneByCode(hdongCode: number | string) {
    const hdong = await this.codeHdongRepo
      .createQueryBuilder('hdong')
      .where('hdong.hdongCode = :hdongCode', { hdongCode: hdongCode })
      .getOne();

    return hdong;
  }
}
