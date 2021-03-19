import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import e from 'express';
import { CodeHdongController } from './code-hdong.controller';
import { CodeHdong } from './code-hdong.entity';
import { CodeHdongService } from './code-hdong.service';

@Module({
  imports: [TypeOrmModule.forFeature([CodeHdong], 'wq')],
  controllers: [CodeHdongController],
  providers: [CodeHdongService],
  exports: [CodeHdongService],
})
export class CodeHdongModule {}
