import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KbFoodCategoryGroup } from '../entities';
import { AdminKbCategoryController } from './admin-menu-analysis.controller';
import { KbCategoryController } from './menu-analysis.controller';
import { MenuAnalysisService } from './menu-analysis.service';

@Module({
  imports: [TypeOrmModule.forFeature([KbFoodCategoryGroup], 'wq')],
  controllers: [AdminKbCategoryController, KbCategoryController],
  providers: [MenuAnalysisService],
})
export class MenuAnalysisModule {}
