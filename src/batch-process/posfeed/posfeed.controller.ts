import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PosfeedService } from './posfeed.service';

@Controller()
@ApiTags('POSFEED')
export class PosfeedController {
  constructor(private readonly posfeedService: PosfeedService) {}

  @Get('posfeed')
  async getPosfeed() {
    return await this.posfeedService.getPosfeedData();
  }
}
