require('dotenv').config();
// google api
export class BaseService {
  analysisUrl: string;
  constructor(url = process.env.PLATFORM_ANALYSIS_URL) {
    this.analysisUrl = url;
  }
}
