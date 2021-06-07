import { Inject } from '@nestjs/common';
import { Args, Resolver, Int, Query } from '@nestjs/graphql';
import { Faq } from './faq.model';
import { FaqService } from './faq.service';

@Resolver(of => Faq)
export class FaqResolver {
  constructor(@Inject(FaqService) private readonly faqService: FaqService) {}
  @Query(returns => Faq, { name: 'faq' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Faq> {
    return await this.faqService.findOne(id);
  }
}
