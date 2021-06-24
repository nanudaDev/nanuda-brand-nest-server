require('dotenv').config();
// process.env.NODE_ENV = EnvironmentType.DEVELOPMENT
import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { PickcookMailerConfigService, TypeOrmConfigService } from './config';
import {
  HttpExceptionFilter,
  ErrorsInterceptor,
  LoggingInterceptor,
} from './core';
import {
  AuthModule,
  CommonCodeModule,
  QuestionModule,
  FaqModule,
  PickcookSalesModule,
  ConsultBaeminReportModule,
  LocationAnalysisModule,
  MenuAnalysisModule,
  CodeHdongModule,
  ResultResponseModule,
  AggregateResultResponseModule,
  ConsultResultModule,
  ProformaConsultResultModule,
  ReservationModule,
  BatchReservationModule,
  PickcookUserModule,
  FileUploadModule,
  GlobalModule,
  SScoreModule,
  QuestionV2Module,
  ProformaConsultResultV2Module,
  ConsultResultV2Module,
  BatchRandomConsultCountTrackerModule,
  ProformaConsultResultV3Module,
  ConsultResultV3Module,
  ProformaEventTrackerModule,
} from './modules';
const env = process.env;
@Module({
  imports: [
    MailerModule.forRootAsync({ useClass: PickcookMailerConfigService }),
    ScheduleModule.forRoot(),
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
      bigNumberStrings: true,
      supportBigNumbers: true,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),

      // migrations: [],
      // cli: {},
      // subscribers: [],
      //   Do not turn to true!!!!
      synchronize: false,
    }),
    // platform db
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
      //   Do not turn to true!!!!
      synchronize: false,
    }),
    AuthModule,
    // FaqModule,
    // AggregateResultResponseModule,
    CommonCodeModule,
    CodeHdongModule,
    ConsultResultV2Module,
    ConsultResultV3Module,
    ConsultResultModule,
    ConsultBaeminReportModule,
    // FileUploadModule,
    // GlobalModule,
    QuestionModule,
    LocationAnalysisModule,
    MenuAnalysisModule,
    PickcookUserModule,
    // ProformaConsultResultModule,
    // ResultResponseModule,
    // ReservationModule,
    BatchReservationModule,
    // Version 2 Modules
    QuestionV2Module,
    ProformaConsultResultV2Module,
    ProformaConsultResultV3Module,
    // S-Score Module
    SScoreModule,
    // Pickcook Sales Module
    PickcookSalesModule,
    // Tracker Modules
    ProformaEventTrackerModule,
    // Batch modules
    BatchRandomConsultCountTrackerModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
