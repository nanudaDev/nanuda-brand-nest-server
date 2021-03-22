import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProformaConsultResultController } from './proforma-consult-result.controller';
import { ProformaConsultResult } from './proforma-consult-result.entity';
import { ProformaConsultResultService } from './proforma-consult-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProformaConsultResult])],
  controllers: [ProformaConsultResultController],
  providers: [ProformaConsultResultService],
  exports: [ProformaConsultResultService],
})
export class ProformaConsultResultModule {}
