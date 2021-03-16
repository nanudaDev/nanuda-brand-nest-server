import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultResultController } from './consult-result.controller';
import { ConsultResult } from './consult-result.entity';
import { ConsultResultService } from './consult-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultResult])],
  controllers: [ConsultResultController],
  providers: [ConsultResultService],
  exports: [ConsultResultService],
})
export class ConsultResultModule {}
