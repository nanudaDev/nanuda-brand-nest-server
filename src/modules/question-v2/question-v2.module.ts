import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionV2Controller } from './question-v2.controller';
import { QuestionV2 } from './question-v2.entity';
import { QuestionV2Service } from './question-v2.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionV2])],
  controllers: [QuestionV2Controller],
  providers: [QuestionV2Service],
  exports: [QuestionV2Service],
})
export class QuestionV2Module {}
