import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CScoreAttribute } from '../entities';
import { CScoreService } from './c-score.service';
import { AdminCScoreController } from './admin-c-score.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CScoreAttribute])],
  controllers: [AdminCScoreController],
  providers: [CScoreService],
  exports: [CScoreService],
})
export class CScoreAttributeModule {}
