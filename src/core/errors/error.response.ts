import { HttpStatus } from '@nestjs/common';

export enum ERROR_TYPE {
  SERVER = 'SERVER',
  VALIDATOR = 'VALIDATOR',
  SERVICE = 'SERVICE',
}

export class ErrorResponse {
  code: string;
  statusCode: HttpStatus;
  type: ERROR_TYPE;
  message: string;
  value?: object = {};
  errors?: { [key: string]: FieldError };
  errorLocale?: any;
}

export class FieldError {
  validator: string;
  value?: object;
  message: any;
}
