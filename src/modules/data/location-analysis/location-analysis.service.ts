require('dotenv').config();
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BaseService, BrandAiException } from 'src/core';
import { LocationAnalysisDto } from './dto';
import Axios from 'axios';

class LocationResults {
  results?: any;
}
@Injectable()
export class LocationAnalysisService extends BaseService {
  constructor() {
    super();
  }

  /**
   * get revenue data
   * @param locationAnalysisQueryDto
   */
  async getRevenueForLocation(
    locationAnalysisQueryDto?: LocationAnalysisDto,
  ): Promise<any> {
    if (
      !locationAnalysisQueryDto.hdongCode &&
      locationAnalysisQueryDto.mediumCategoryCode
    ) {
      throw new BrandAiException('data.parameterError');
    }
    // revenue data from analysis server
    const revenueData = await Axios.get(`${this.analysisUrl}location-info`, {
      params: locationAnalysisQueryDto,
    });
    // throw something when there isnt enough data
    if (typeof revenueData.data === 'string') {
      return 'something else';
    }
    return revenueData.data;
  }
}
