import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultResultV3MessageLog } from './consult-result-v3-message-log.entity';
import { ConsultResultV3MessageLogService } from './consult-result-v3-message-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultResultV3MessageLog])],
  providers: [ConsultResultV3MessageLogService],
  exports: [ConsultResultV3MessageLogService],
})
export class ConsultResultV3MessageLogModule {}
