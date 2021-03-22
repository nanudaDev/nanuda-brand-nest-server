import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { AdminFaqCreateDto, AdminFaqUpdateDto, FaqAnswerListDto } from './dto';
import { Faq } from './faq.entity';

@Injectable()
export class FaqService extends BaseService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create new faq for admin
   * @param adminFaqCreateDto
   */
  async createFaqForAdmin(adminFaqCreateDto: AdminFaqCreateDto): Promise<Faq> {
    const newFaq = await this.entityManager.transaction(async entityManager => {
      let newFaq = new Faq(adminFaqCreateDto);
      newFaq = await entityManager.save(newFaq);
      const answers = [];
      if (
        adminFaqCreateDto.providedAnswers &&
        adminFaqCreateDto.providedAnswers.length > 0
      ) {
        adminFaqCreateDto.providedAnswers.map(answer => {
          const newAnswer = new Faq(answer);
          newAnswer.faqParentId = newFaq.id;
          answers.push(newAnswer);
        });
      }
      await entityManager
        .createQueryBuilder()
        .insert()
        .into(Faq)
        .values(answers)
        .execute();

      return newFaq;
    });
    return newFaq;
  }

  /**
   * update faq for admin
   * @param id
   * @param adminFaqUpdateDto
   */
  async updateFaqForAdmin(
    id: number,
    adminFaqUpdateDto: AdminFaqUpdateDto,
  ): Promise<Faq> {
    let faq = await this.faqRepo.findOne(id);
    if (!faq) {
      throw new BrandAiException('faq.notFound');
    }
    faq = faq.set(adminFaqUpdateDto);
    faq = await this.faqRepo.save(faq);
    return faq;
  }

  /**
   * get faqs for users
   * @param faqAdminListDto
   */
  async findAllForUsers(faqAdminListDto: FaqAnswerListDto): Promise<Faq[]> {
    const qb = this.faqRepo
      .createQueryBuilder('faq')
      .select(['faq.faq', 'faq.order', 'faq.id'])
      .where('faq.order IS NOT NULL');
    // .WhereAndOrder(faqAdminListDto);

    if (faqAdminListDto.faqParentId) {
      qb.andWhere('faq.faq IS NULL');
      qb.addSelect(['faq.answer']);
      qb.AndWhereEqual(
        'faq',
        'faqParentId',
        faqAdminListDto.faqParentId,
        faqAdminListDto.exclude('faqParentId'),
      );
      qb.WhereAndOrder(faqAdminListDto);
    } else {
      qb.andWhere('faq.faq IS NOT NULL');
      qb.WhereAndOrder(faqAdminListDto);
    }
    return qb.getMany();
  }
}
