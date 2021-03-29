import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { Repository } from 'typeorm';
import { CommonCode } from './common-code.entity';
import {
  AdminCommonCodeCreateDto,
  AdminCommonCodeListDto,
  AdminCommonCodeUpdateDto,
  CommonCodeListDto,
} from './dto';

export class CommonCodeService extends BaseService {
  constructor(
    @InjectRepository(CommonCode)
    private readonly commonCodeRepo: Repository<CommonCode>,
  ) {
    super();
  }

  /**
   * create new common code for admin
   * @param adminCommonCodeCreateDto
   */
  async createForAdmin(
    adminCommonCodeCreateDto: AdminCommonCodeCreateDto,
  ): Promise<CommonCode> {
    let commonCode = new CommonCode(adminCommonCodeCreateDto);
    commonCode = await this.commonCodeRepo.save(commonCode);
    return commonCode;
  }

  /**
   * update common code for admin
   * @param id
   * @param adminCommonCodeUpdateDto
   */
  async updateForAdmin(
    id: number,
    adminCommonCodeUpdateDto: AdminCommonCodeUpdateDto,
  ): Promise<CommonCode> {
    let commonCode = await this.findOneForAdmin(id);
    commonCode = commonCode.set(adminCommonCodeUpdateDto);
    commonCode = await this.commonCodeRepo.save(commonCode);
    return commonCode;
  }

  /**
   * find one
   * @param id
   */
  async findOneForAdmin(id: number): Promise<CommonCode> {
    const commonCode = await this.commonCodeRepo
      .createQueryBuilder('commonCode')
      .where('commonCode.id = :id', { id: id })
      .getOne();

    if (!commonCode) {
      throw new BrandAiException('commonCode.notFound');
    }
    return commonCode;
  }

  /**
   * find all for admin
   * @param adminCommonCodeListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminCommonCodeListDto: AdminCommonCodeListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CommonCode>> {
    console.log(adminCommonCodeListDto);
    const qb = this.commonCodeRepo
      .createQueryBuilder('commonCode')
      .AndWhereLike(
        'commonCode',
        'key',
        adminCommonCodeListDto.key,
        adminCommonCodeListDto.exclude('key'),
      )

      .AndWhereLike(
        'commonCode',
        'value',
        adminCommonCodeListDto.value,
        adminCommonCodeListDto.exclude('value'),
      )
      .AndWhereLike(
        'commonCode',
        'category',
        adminCommonCodeListDto.category,
        adminCommonCodeListDto.exclude('category'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminCommonCodeListDto)
      .getManyAndCount();

    const [items, totalCount] = await qb;

    return { items, totalCount };
  }

  /**
   * find all common code for users
   * @param commonCodeListDto
   */
  async findForAllUsers(
    commonCodeListDto: CommonCodeListDto,
  ): Promise<CommonCode[]> {
    console.log(commonCodeListDto);
    const qb = this.commonCodeRepo
      .createQueryBuilder('commonCode')
      .AndWhereLike(
        'commonCode',
        'key',
        commonCodeListDto.key,
        commonCodeListDto.exclude('key'),
      )
      .AndWhereLike(
        'commonCode',
        'value',
        commonCodeListDto.value,
        commonCodeListDto.exclude('value'),
      )
      .AndWhereLike(
        'commonCode',
        'category',
        commonCodeListDto.category,
        commonCodeListDto.exclude('category'),
      )
      .AndWhereLike(
        'commonCode',
        'additionalDisplayValue',
        commonCodeListDto.additionalDisplayValue,
        commonCodeListDto.exclude('additionalDisplayValue'),
      )
      .WhereAndOrder(commonCodeListDto)
      .getMany();

    return await qb;
  }
}
