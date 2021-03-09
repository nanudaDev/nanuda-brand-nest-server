require('dotenv').config();
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config';
import { HttpExceptionFilter, ErrorsInterceptor } from './core';
import {
  AdminModule,
  AuthModule,
  CommonCodeModule,
  QuestionModule,
  FaqModule,
  LocationAnalysisModule,
  MenuAnalysisModule,
  CodeHdongModule,
  ResultResponseModule,
} from './modules';
const env = process.env;
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    // 상권분석 관련 디비
    TypeOrmModule.forRoot({
      name: 'wq',
      type: 'mysql' as 'mysql',
      host: env.ANALYSIS_DB_HOST,
      port: Number(env.ANALYSIS_DB_PORT),
      username: env.ANALYSIS_DB_USERNAME,
      password: env.ANALYSIS_DB_PASSWORD,
      database: env.ANALYSIS_DB_DATABASE,
      // won't need to keep alive
      //   keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),

      // migrations: [],
      // cli: {},
      // subscribers: [],
      //   Do not turn to true!!!! 나누다 키친 데이터 다 날라가요 ~ ㅠㅠ
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'platform',
      type: 'mysql' as 'mysql',
      host: env.PLATFORM_DB_HOST,
      port: Number(env.PLATFORM_DB_PORT),
      username: env.PLATFORM_DB_USERNAME,
      password: env.PLATFORM_DB_PASSWORD,
      database: env.PLATFORM_DB_DATABASE,
      // won't need to keep alive
      //   keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),

      // migrations: [],
      // cli: {},
      // subscribers: [],
      //   Do not turn to true!!!! 나누다 키친 데이터 다 날라가요 ~ ㅠㅠ
      synchronize: false,
    }),
    FaqModule,
    AdminModule,
    AuthModule,
    CommonCodeModule,
    CodeHdongModule,
    QuestionModule,
    LocationAnalysisModule,
    MenuAnalysisModule,
    ResultResponseModule,
  ],
  controllers: [],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
  ],
})
export class AppModule {}
