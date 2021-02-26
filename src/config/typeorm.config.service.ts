import { Injectable } from '@nestjs/common';
import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { getMetadataArgsStorage } from 'typeorm';

require('dotenv').config();
const env = process.env;
// do we need to do a debug?
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: false,
    };
  }
}
