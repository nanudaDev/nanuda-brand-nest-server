import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionV2 } from './question-v2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionV2])],
  controllers: [],
  providers: [],
  exports: [],
})
export class QuestionV2Module {}
