import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminResultResponseController } from './admin-result-response.controller';
import { ResultResponseController } from './result-response.controller';
import { ResultResponse } from './result-response.entity';
import { ResultResponseService } from './result-response.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResultResponse])],
  controllers: [AdminResultResponseController, ResultResponseController],
  providers: [ResultResponseService],
  exports: [],
})
export class ResultResponseModule {}
