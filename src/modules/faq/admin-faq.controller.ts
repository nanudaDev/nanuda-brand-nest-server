import { Body, Controller, Post } from '@nestjs/common';
import { FaqCreateDto } from './dto';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';

@Controller()
export class AdminFaqController {
  constructor(private readonly faqService: FaqService) {}
  /**
   *
   * @param faqCreateDto faq를 생성
   */
  @Post('/faq')
  async create(@Body() faqCreateDto: FaqCreateDto): Promise<Faq> {
    return await this.faqService.createFaqForAdmin(faqCreateDto);
  }
}
