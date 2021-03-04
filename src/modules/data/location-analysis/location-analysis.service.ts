require('dotenv').config();
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BaseService } from 'src/core';
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
    const revenueData = await Axios.get(`${this.analysisUrl}location-info`, {
      params: locationAnalysisQueryDto,
    });
    return revenueData.data;
  }
}
