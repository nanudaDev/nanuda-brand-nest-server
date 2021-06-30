import { Module } from '@nestjs/common';
import { PosfeedController } from './posfeed.controller';
import { PosfeedService } from './posfeed.service';

@Module({
  imports: [],
  controllers: [PosfeedController],
  providers: [PosfeedService],
})
export class PosfeedModule {}
