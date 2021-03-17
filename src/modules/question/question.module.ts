import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionTracker } from '../question-tracker/question-tracker.entity';
import { AdminQuestionController } from './admin-question.controller';
import { QuestionController } from './question.controller';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionTracker])],
  controllers: [AdminQuestionController, QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
