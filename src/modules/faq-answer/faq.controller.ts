import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseController } from 'src/core';
import { FaqAnswerListDto } from './dto';
import { Faq } from './faq.model';
import { FaqService } from './faq.service';

@Controller()
@ApiTags('FAQ')
export class FaqController extends BaseController {
  constructor(private readonly faqService: FaqService) {
    super();
  }

  /**
   * get faq for all users
   * @param faqAnswerListDto
   */
  @Get('/faq-answer')
  async findAll(@Query() faqAnswerListDto: FaqAnswerListDto): Promise<Faq[]> {
    return await this.faqService.findAllForUsers(faqAnswerListDto);
  }
}
