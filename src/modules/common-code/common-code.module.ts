import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCode } from './common-code.entity';
import { CommonCodeService } from './common-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommonCode])],
  controllers: [],
  providers: [CommonCodeService],
})
export class CommonCodeModule {}
