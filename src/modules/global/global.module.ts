import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalController } from './global.controller';
import { GlobalService } from './global.service';
import { SiteInServiceRecordBackup } from './site-in-service-record-backup.entity';
import { SiteInServiceRecord } from './site-in-service-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteInServiceRecord, SiteInServiceRecordBackup]),
  ],
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
