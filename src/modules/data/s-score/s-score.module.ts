import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SScoreDelivery, SScoreRestaurant } from '../entities';
import { SScoreController } from './s-score.controller';
import { SScoreService } from './s-score.service';

@Module({
  imports: [TypeOrmModule.forFeature([SScoreDelivery, SScoreRestaurant], 'wq')],
  controllers: [SScoreController],
  providers: [SScoreService],
  exports: [SScoreService],
})
export class SScoreModule {}
