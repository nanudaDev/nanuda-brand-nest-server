import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommonCodeController } from './admin-common-code.controller';
import { CommonCodeController } from './common-code.controller';
import { CommonCode } from './common-code.entity';
import { CommonCodeService } from './common-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommonCode])],
  controllers: [AdminCommonCodeController, CommonCodeController],
  providers: [CommonCodeService],
  exports: [CommonCodeService],
})
export class CommonCodeModule {}
