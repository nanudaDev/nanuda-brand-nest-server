import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse, ERROR_TYPE, FieldError } from './error.response';

export class BaseException extends HttpException {
  error: ErrorResponse;
  constructor(status: HttpStatus, code: string);
  constructor(status: HttpStatus, code: string, value: object);
  constructor(status: HttpStatus, code: string, message: string);
  constructor(status: HttpStatus, code: string, message: string, value: object);
  constructor(
    status: HttpStatus,
    code: string,
    message?: string | object,
    value?: object,
  ) {
    super(code, status);
    if (message) {
      if (typeof message === 'object') {
        this.error = {
          code,
          statusCode: status,
          type: ERROR_TYPE.SERVICE,
          message: undefined,
          value: message,
        };
      } else {
        this.error = {
          code,
          statusCode: status,
          type: ERROR_TYPE.SERVICE,
          message,
          value,
        };
      }
    } else {
      this.error = {
        code,
        statusCode: status,
        type: ERROR_TYPE.SERVICE,
        message: message as string,
        value,
      };
    }
  }

  geCode(): string {
    return this.error.code;
  }

  getResponse() {
    return this.error;
  }

  addFieldError(field: string, fieldError: FieldError): this {
    if (!this.error.errors) this.error.errors = {};

    this.error.errors[field] = fieldError;
    return this;
  }
}
