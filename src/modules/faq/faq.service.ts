import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { FaqCreateDto } from './dto';
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

  async findAll(): Promise<Faq[]> {
    const qb = this.FaqRepository.createQueryBuilder();
    const results = await qb.getMany();
    return results;
  }
}
