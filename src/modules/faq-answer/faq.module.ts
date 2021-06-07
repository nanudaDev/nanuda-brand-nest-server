import { FaqService } from './faq.service';
import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { Faq } from './faq.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminFaqController } from './admin-faq.controller';
import { FaqResolver } from './faq.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController, AdminFaqController],
  providers: [FaqService, FaqResolver],
  exports: [FaqService],
})
export class FaqModule {}
