import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsultResultV3MessageLog } from './consult-result-v3-message-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConsultResultV3MessageLogService {
  constructor(
    @InjectRepository(ConsultResultV3MessageLog)
    private readonly consultMessageRepo: Repository<ConsultResultV3MessageLog>,
  ) {}

  /**
   * create new log
   * @param consultResultId
   * @param adminId
   * @param message
   */
  async createLog(consultResultId: number, adminId: number, message: string) {
    let newLog = new ConsultResultV3MessageLog();
    newLog.message = message;
    newLog.adminId = adminId;
    newLog.consultResultId = consultResultId;

    await this.consultMessageRepo.save(newLog);
  }
}
