import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSales } from '../entities/pickcook-sales.entity';
import { AdminPickcookSalesController } from './admin-pickcook-sales.controller';
import { PickcookSalesService } from './pickcook-sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickcookSales], 'wq')],
  controllers: [AdminPickcookSalesController],
  providers: [PickcookSalesService],
  exports: [PickcookSalesService],
})
export class PickcookSalesModule {}
