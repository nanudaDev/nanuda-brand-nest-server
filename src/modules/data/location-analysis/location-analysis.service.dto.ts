require('dotenv').config();
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BaseService } from 'src/core';
import { LocationAnalysisDto } from './dto';
import Axios from 'axios';

// FLASK URL
const analysisUrl = process.env.PLATFORM_ANALYSIS_URL;
// fix once there is a clear data structure
class LocationResults {
  results?: any;
}
@Injectable()
export class LocationAnalysisService extends BaseService {
  constructor() {
    super();
  }

  async getRevenueForLocation(
    locationAnalysisQueryDto: LocationAnalysisDto,
  ): Promise<any> {
    //   fetch with axios
  }
}
