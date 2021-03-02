import { Body, Controller, Get, Post } from '@nestjs/common';
import { FaqCreateDto } from './dto';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';

@Controller()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('/faq')
  async findAll(): Promise<Faq[]> {
    return await this.faqService.findAll();
  }
}
