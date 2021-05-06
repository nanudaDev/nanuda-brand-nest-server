import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CScoreAttribute } from '../entities';
import { CScoreService } from './c-score.service';

@Module({
  imports: [TypeOrmModule.forFeature([CScoreAttribute])],
  controllers: [],
  providers: [CScoreService],
  exports: [CScoreService],
})
export class CScoreAttributeModule {}
