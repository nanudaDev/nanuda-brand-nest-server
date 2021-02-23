require('dotenv').config();
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Debug from 'debug';
import { basename } from 'path';
import { ENVIRONMENT } from './config';
import { json, urlencoded } from 'body-parser';
import * as requestIp from 'request-ip';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import * as packageInfo from '../package.json';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';

const debug = Debug(`brand-ai:${basename(__dirname)}:${basename(__filename)}`);
const env = process.env.NODE_ENV;

// if no environment set
if (!env) {
  console.log('No environments running!');
  throw new Error('No environment running!');
}

let app: NestExpressApplication;
declare const module: any;

async function bootstrap() {
  if (env !== ENVIRONMENT.PRODUCTION) {
    console.log(`Running in ${env} mode!`);
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: true,
    });
  } else {
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      // logger: true
    });
  }

  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '50mb' }));
  app.disable('x-powered-by');
  app.setViewEngine('hbs');
  app.use(compression());
  app.use(cookieParser());
  app.use(helmet()); // https://helmetjs.github.io/
  app.use(requestIp.mw());

  app.enableCors();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true,
      // skipNullProperties: true,
      // skipUndefinedProperties: false,
      validationError: { target: false, value: false }, // object 와 value 역전송 막기
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      } as ClassTransformOptions, // version문제로 실제 있지만 여기 없음.. down casting
    }),
  );

  // Swagger
  if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
    const options = new DocumentBuilder()
      .setTitle(packageInfo.name.toUpperCase())
      .setDescription(packageInfo.description)
      .setVersion(packageInfo.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('brand ai swagger', app, document);
  }

  // 3100 for brand port
  await app.listen(3100);

  const url = await app.getUrl();
  if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
    Logger.log(`${url}`, 'NestApplication');
    Logger.log(`${url}/swagger`, 'NestApplication');
  }

  // HMR: Hot Reload (Webpack)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

/**
 * Graceful shutdown
 */
// Prevents the program from closing instantly
process.stdin.resume();

async function shutdown() {
  if (app) {
    const conn = getConnection();
    debug('database connected: %o', conn.isConnected);
    if (conn.isConnected) {
      await conn.close();
      debug('database connection closed');
      debug('database connected: %o', conn.isConnected);
    }
    await app.close();
    app = null;
    debug('app closed');
    process.exit();
  }
}

process.on('exit', code => {
  console.log(`About to exit with code: ${code}`);
});

// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  shutdown();
});

// catch console is closing on windows
process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
  shutdown();
});

// catch "kill pid"
process.on('SIGUSR1', () => {
  console.log('Got SIGUSR1 signal.');
  shutdown();
});
process.on('SIGUSR2', () => {
  console.log('Got SIGUSR2 signal.');
  shutdown();
});

// catch uncaught exceptions
// process.on('uncaughtException', err => {
//   console.error('uncaughtException', err);
//   shutdown();
// });

bootstrap();
