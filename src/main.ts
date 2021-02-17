require('dotenv').config()
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Debug from 'debug'
import {basename} from 'path'
import { ENVIRONMENT } from './config';
import { json, urlencoded } from 'body-parser';
import * as requestIp from 'request-ip'
import * as helmet from 'helmet'
import * as compression from 'compression'

const debug = Debug(`nanuda-brand:${basename(__dirname)}:${basename(__filename)}`)
const env = process.env.NODE_ENV

let app: NestApplication
declare const module: any[]

async function bootstrap() {
    if(env !== ENVIRONMENT.PRODUCTION) {
      console.log(`Running in ${env} mode!`);
      app = await NestFactory.create<NestApplication>(AppModule, {
        logger: true
      })
    } else {
      app = await NestFactory.create<NestApplication>(AppModule, {
        // logger: true
      })
    }
}

app.use(urlencoded({extended: true}))
app.use(json({limit: '50mb'}))
// app.disable('x-powered-by');
// app.setViewEngine('hbs');
app.use(compression());
// app.use(cookieParser());
app.use(helmet()); // https://helmetjs.github.io/
app.use(requestIp.mw());

// if no environment set 
if(!env) {
  console.log('No environments running!')
  throw new Error('No environment running!')
}

