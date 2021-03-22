import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { QuestionAnsweredDto, QuestionQueryDto } from './dto';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Controller()
@ApiTags('QUESTION')
export class QuestionController extends BaseController {
  constructor(private readonly questionService: QuestionService) {
    super();
  }

  /**
   * find specific question
   * @param questionQueryDto
   */
  @Get('/question')
  async findQuestion(
    @Query() questionQueryDto: QuestionQueryDto,
  ): Promise<Question> {
    return await this.questionService.findQuestion(questionQueryDto);
  }

  /**
   * track questions and get next question
   * @param questionAnsweredDto
   */
  @Post('/question/next')
  async findNextQuestion(
    @Body() questionAnsweredDto: QuestionAnsweredDto,
  ): Promise<Question> {
    return await this.questionService.questionAnswered(questionAnsweredDto);
  }
}
