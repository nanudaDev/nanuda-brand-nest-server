import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSales } from '../entities/pickcook-sales.entity';
import { SScoreModule } from '../s-score/s-score.module';
import { AdminPickcookSalesController } from './admin-pickcook-sales.controller';
import { PickcookSalesService } from './pickcook-sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickcookSales], 'wq'), SScoreModule],
  controllers: [AdminPickcookSalesController],
  providers: [PickcookSalesService],
  exports: [PickcookSalesService],
})
export class PickcookSalesModule {}
