import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminResultResponseController } from './admin-result-response.controller';
import { ResultResponseBackup } from './result-response-backup.entity';
import { ResultResponseController } from './result-response.controller';
import { ResultResponse } from './result-response.entity';
import { ResultResponseService } from './result-response.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResultResponse, ResultResponseBackup])],
  controllers: [AdminResultResponseController, ResultResponseController],
  providers: [ResultResponseService],
  exports: [],
})
export class ResultResponseModule {}
