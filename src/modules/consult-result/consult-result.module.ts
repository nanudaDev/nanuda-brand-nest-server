import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminConsultResponseController } from './admin-consult-result.controller';
import { ConsultResultController } from './consult-result.controller';
import { ConsultResult } from './consult-result.entity';
import { ConsultResultService } from './consult-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultResult])],
  controllers: [AdminConsultResponseController, ConsultResultController],
  providers: [ConsultResultService],
  exports: [ConsultResultService],
})
export class ConsultResultModule {}
