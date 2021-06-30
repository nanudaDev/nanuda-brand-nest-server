import { Injectable } from '@nestjs/common';
import Axios from 'axios';

@Injectable()
export class PosfeedService {
  constructor() {}

  async getPosfeedData() {
    const auth = await this.__auth();

    console.log(auth);
    const config = {
      headers: { api_key: `Bearer ${auth}` },
    };
    // get total count first
    const list = await Axios.get(
      'https://admin.posfeed.co.kr/order-info/list?page=1&size=357&st=2021-06-23T00%3A00%3A00.000&ed=2021-06-24T23%3A59%3A59.999&test=false&searchType=orderNumber&sort=regdate%2Cdesc',
      config,
    );
    return list.data.data;
  }

  private async __auth() {
    const prinicipal = 'nanuda@widaehan.com';
    const credentials = 'gtc142600';

    const data = await Axios.post('https://admin.posfeed.co.kr/auth', {
      principal: prinicipal,
      credentials: credentials,
    });

    return data.data.data.token;
  }
}
