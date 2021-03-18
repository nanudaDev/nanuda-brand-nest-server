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

  /**
   * 지역 최저, 최고 매출 호출
   * @param locationAnalysisDto
   */
  @Get('/location-analysis/revenue-data')
  async revenueData(@Query() locationAnalysisDto: LocationAnalysisDto) {
    return await this.locationAnalysisService.getRevenueForLocation(
      locationAnalysisDto,
    );
  }

  /**
   * 시간대별 데아터
   * @param locationAnalysisDto
   */
  @Get('/location-analysis/revenue-data-hour')
  async hourlyData(@Query() locationAnalysisDto: LocationAnalysisDto) {
    return await this.locationAnalysisService.getBestMenuByTime(
      locationAnalysisDto,
    );
  }

  /**
   * 시간대별 데아터
   * @param locationAnalysisDto
   */
  @Get('/location-analysis/location-info-detail')
  async testData(@Query() locationAnalysisDto: LocationAnalysisDto) {
    return await this.locationAnalysisService.locationInfoDetail(
      locationAnalysisDto.hdongCode,
    );
  }
}
