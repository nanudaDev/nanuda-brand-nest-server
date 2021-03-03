import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { FaqCreateDto, FaqUpdateDto } from './dto';
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
  /**
   *
   * @param faqUpdateDto
   */
  @Patch('/faq/:id([0-9]+)')
  async update(
    @Param() id: number,
    @Body() faqUpdateDto: FaqUpdateDto,
  ): Promise<Faq> {
    return await this.faqService.updateFaqForAdmin(id, faqUpdateDto);
  }
}
