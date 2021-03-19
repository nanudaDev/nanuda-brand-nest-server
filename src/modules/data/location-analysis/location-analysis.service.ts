require('dotenv').config();
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BaseService, BrandAiException } from 'src/core';
import { LocationAnalysisDto } from './dto';
import Axios from 'axios';

class LocationResults {
  results?: any | string;
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
  async getRevenueForLocation(locationAnalysisQueryDto?: LocationAnalysisDto) {
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
    // if (typeof revenueData.data === 'string') {
    //   return 'something else';
    // }
    return revenueData.data;
  }

  /**
   * 시간대별 데이터
   * @param locationAnalysisQueryDto
   */
  async getBestMenuByTime(
    locationAnalysisQueryDto?: LocationAnalysisDto,
  ): Promise<LocationResults> {
    const data = await Axios.get(`${this.analysisUrl}location-hour`, {
      params: { hdongCode: locationAnalysisQueryDto.hdongCode },
    });
    return data.data;
  }

  /**
   * data for location infor detail
   * 비중
   * @param hdongCode
   */
  async locationInfoDetail(hdongCode: string) {
    const data = await Axios.get(`${this.analysisUrl}location-info-detail`, {
      params: { hdongCode: hdongCode },
    });
    return data.data;
  }
}
