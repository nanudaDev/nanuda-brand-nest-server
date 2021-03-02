import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { FaqCreateDto } from './dto';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';

@Controller()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('/faq')
  async findAll(
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Faq>> {
    return await this.faqService.findAll(pagination);
  }
}
