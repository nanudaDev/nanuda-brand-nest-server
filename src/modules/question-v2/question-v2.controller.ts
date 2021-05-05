import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { QuestionV2QueryDto, QuestionV2AnsweredDto } from './dto';
import { QuestionV2 } from './question-v2.entity';
import { QuestionV2Service } from './question-v2.service';

@Controller('v2')
@ApiTags('QUESTION V2')
export class QuestionV2Controller extends BaseController {
  constructor(private readonly questionV2Service: QuestionV2Service) {
    super();
  }

  /**
   * find specific question
   * @param questionQueryDto
   */
  @Get('/question')
  async findQuestion(
    @Query() questionQueryDto: QuestionV2QueryDto,
  ): Promise<QuestionV2> {
    return await this.questionV2Service.findQuestion(questionQueryDto);
  }

  /**
   * track questions and get next question
   * @param questionAnsweredDto
   */
  @Post('/question/next')
  async findNextQuestion(
    @Body() questionAnsweredDto: QuestionV2AnsweredDto,
  ): Promise<QuestionV2> {
    return await this.questionV2Service.questionAnswered(questionAnsweredDto);
  }
}
