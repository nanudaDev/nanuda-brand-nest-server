import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { FaqCreateDto, FaqUpdateDto } from './dto';
import { Faq } from './faq.entity';

@Injectable()
export class FaqService extends BaseService {
  constructor(
    @InjectRepository(Faq)
    private readonly FaqRepository: Repository<Faq>,
  ) {
    super();
  }
  /**
   *
   * @param faqCreateDto
   */
  async createFaqForAdmin(faqCreateDto: FaqCreateDto): Promise<Faq> {
    let faq = new Faq(faqCreateDto);
    faq = await this.FaqRepository.save(faqCreateDto);
    return faq;
  }
  /**
   *
   * @param faqUpdateDto
   */
  async updateFaqForAdmin(
    id: number,
    faqUpdateDto: FaqUpdateDto,
  ): Promise<Faq> {
    let theFaq = await this.findOneForAdmin(id);
    if (!theFaq) {
      throw new NotFoundException();
    }
    theFaq = theFaq.set(faqUpdateDto);
    return await this.FaqRepository.save(theFaq);
  }
  /**
   * find one
   * @param id
   */
  async findOneForAdmin(id: number): Promise<Faq> {
    const theFaq = await this.FaqRepository.createQueryBuilder('faq')
      .where('faq.id = :id', { id: id })
      .getOne();

    if (!theFaq) {
      throw new NotFoundException('faq not found');
    }
    return theFaq;
  }
  async findAll(pagination: PaginatedRequest): Promise<PaginatedResponse<Faq>> {
    const qb = this.FaqRepository.createQueryBuilder();
    qb.Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
