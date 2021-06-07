import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_ROLES } from 'src/shared';
import { AdminFaqCreateDto, AdminFaqUpdateDto } from './dto';
import { Faq } from './faq.model';
import { FaqService } from './faq.service';

@Controller()
@ApiTags('ADMIN FAQ')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_ROLES))
export class AdminFaqController extends BaseController {
  constructor(private readonly faqService: FaqService) {
    super();
  }
  /**
   * create faq for admin
   * @param adminFaqCreateDto
   *    */
  @Post('/admin/faq-answer')
  async create(@Body() adminFaqCreateDto: AdminFaqCreateDto): Promise<Faq> {
    return await this.faqService.createFaqForAdmin(adminFaqCreateDto);
  }

  /**
   *
   * @param adminFaqUpdateDto
   */
  @Patch('/admin/faq/:id([0-9]+)')
  async update(
    @Param() id: number,
    @Body() adminFaqUpdateDto: AdminFaqUpdateDto,
  ): Promise<Faq> {
    return await this.faqService.updateFaqForAdmin(id, adminFaqUpdateDto);
  }
}
