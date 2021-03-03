require('dotenv').config();
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config';
import { HttpExceptionFilter, ErrorsInterceptor } from './core';
import {
  AdminModule,
  AuthModule,
  CommonCodeModule,
  FaqModule,
} from './modules';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    FaqModule,
    AdminModule,
    AuthModule,
    CommonCodeModule,
  ],
  controllers: [],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
  ],
})
export class AppModule {}
