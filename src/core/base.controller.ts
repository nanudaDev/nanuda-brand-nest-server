require('dotenv').config();
export class BaseController {
  analysisUrl: string;
  constructor(url = process.env.PLATFORM_ANALYSIS_URL) {
    this.analysisUrl = url;
  }
}
