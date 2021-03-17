require('dotenv').config();
import { basename } from 'path';
import * as Joi from '@hapi/joi';
export interface EnvConfig {
  [key: string]: string;
}

export class EnvConfigService {
  private readonly _envConfig: EnvConfig;
  constructor() {
    const validatedEnvConfig = this._validatedEnv(process.env);
    this._processEnvConfig(validatedEnvConfig);
  }

  private _processEnvConfig(envConfig) {
    Object.keys(envConfig).forEach(key => {
      process.env[key] = envConfig[key];
    });
  }

  private _validatedEnv(envConfig: EnvConfig): EnvConfig {
    const envVarSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
    });

    const {
      error,
      value: validatedEnvConfig,
    } = envVarSchema.validate(envConfig, { allowUnknown: true });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  env() {
    return this._envConfig;
  }
}
