import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSmallCategoryInfo } from '../entities';
import { PickcookSmallCategoryService } from './pickcook-small-category-info.service';
import { AdminPickcookSmallCategoryInfoController } from './admin-pickcook-small-category-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PickcookSmallCategoryInfo], 'wq')],
  controllers: [AdminPickcookSmallCategoryInfoController],
  providers: [PickcookSmallCategoryService],
  exports: [PickcookSmallCategoryService],
})
export class PickcookSmallCategoryInfoModule {}
