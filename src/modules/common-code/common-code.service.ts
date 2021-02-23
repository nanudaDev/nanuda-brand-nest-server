import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, BrandAiException } from 'src/core';
import { Repository } from 'typeorm';
import { CommonCode } from './common-code.entity';
import { AdminCommonCodeCreateDto, AdminCommonCodeUpdateDto } from './dto';

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
}
