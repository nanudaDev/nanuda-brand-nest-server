import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController } from 'src/core';
import { CONST_ADMIN_ROLES } from 'src/shared';
import {
  AdminQuestionCreateDto,
  AdminQuestionListeDto,
  AdminQuestionUpdateDto,
} from './dto';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Controller()
@ApiTags('ADMIN QUESTION')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_ROLES))
export class AdminQuestionController extends BaseController {
  constructor(private readonly questionService: QuestionService) {
    super();
  }

  /**
   * create question for admin
   * @param adminQuestionCreateDto
   */
  @Post('/admin/question')
  async create(
    @Body() adminQuestionCreateDto: AdminQuestionCreateDto,
  ): Promise<Question> {
    return await this.questionService.createQuestion(adminQuestionCreateDto);
  }

  /**
   * update quesiton for admin
   * @param id
   * @param adminQuestionUpdateDto
   */
  @Patch('/admin/question/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminQuestionUpdateDto: AdminQuestionUpdateDto,
  ): Promise<Question> {
    return await this.questionService.updateQuestion(
      adminQuestionUpdateDto,
      id,
    );
  }

  /**
   * find all for admin
   * @param adminQuestionListDto
   * @param pagination
   */
  @Get(['/admin/question'])
  async findAllForAdmin(
    @Query() adminQuestionListDto: AdminQuestionListeDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Question>> {
    return await this.questionService.findAllForAdmin(
      adminQuestionListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param id
   */
  @Get('/admin/question/:id([0-9]+)')
  async findOneForAdmin(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Question> {
    return await this.questionService.findOneForAdmin(id);
  }

  /**
   * delete for admin
   * @param id
   */
  @Delete('/admin/question/:id([0-9]+)')
  async deleteForAdmin(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Question> {
    return await this.questionService.deleteForAdmin(id);
  }
}
