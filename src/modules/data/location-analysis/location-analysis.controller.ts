import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { LocationAnalysisDto } from './dto';
import { LocationAnalysisService } from './location-analysis.service';

@Controller()
@ApiTags('LOCATION ANALYSIS')
export class LocationAnalysiController extends BaseController {
  constructor(
    private readonly locationAnalysisService: LocationAnalysisService,
  ) {
    super();
  }

  @Get('/location-analysis/revenue-data')
  async revenueData(@Query() locationAnalysisDto: LocationAnalysisDto) {
    return await this.locationAnalysisService.getRevenueForLocation(
      locationAnalysisDto,
    );
  }
}
