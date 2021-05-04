import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickcookSmallCategoryInfo } from '../entities';
import { PickcookSmallCategoryService } from './pickcook-small-category-info.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickcookSmallCategoryInfo], 'wq')],
  providers: [PickcookSmallCategoryService],
  exports: [PickcookSmallCategoryService],
})
export class PickcookSmallCategoryInfoModule {}
