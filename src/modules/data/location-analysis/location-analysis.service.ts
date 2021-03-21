require('dotenv').config();
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BaseService, BrandAiException } from 'src/core';
import { LocationAnalysisDto } from './dto';
import Axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { HdongCodeNoData } from '../hdong-code-no-data/hdong-code-no-data.entity';
import { Repository } from 'typeorm';
import { YN } from 'src/common';

class LocationResults {
  results?: any | string;
}
@Injectable()
export class LocationAnalysisService extends BaseService {
  constructor(
    @InjectRepository(HdongCodeNoData)
    private readonly hdongCodeNoDataRepo: Repository<HdongCodeNoData>,
  ) {
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
    let checkIfDataIsIn = await this.hdongCodeNoDataRepo.findOne({
      where: { hdongCode: locationAnalysisQueryDto.hdongCode },
    });
    if (revenueData.data.value && revenueData.data.value.length < 1) {
      // TODO: randomize these numbers

      if (!checkIfDataIsIn) {
        const newData = new HdongCodeNoData({
          hdongCode: locationAnalysisQueryDto.hdongCode,
          endpoint: '/location-info',
        });
        await this.hdongCodeNoDataRepo.save(newData);
      }
      revenueData.data = { value: [7820000, 27400000] };
    }
    if (checkIfDataIsIn) {
      checkIfDataIsIn.isUsable = YN.YES;
      await this.hdongCodeNoDataRepo.save(this.hdongCodeNoDataRepo);
    }
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
