import { FaqService } from './faq.service';
import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { Faq } from './faq.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminFaqController } from './admin-faq.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController, AdminFaqController],
  providers: [FaqService],
})
export class FaqModule {}
