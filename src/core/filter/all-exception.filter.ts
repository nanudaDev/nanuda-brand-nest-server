import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ERROR_TYPE, ErrorResponse } from '..';
// import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const errorResponse: ErrorResponse = {
      code: exception.name,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      type: ERROR_TYPE.SERVER,
      message: `Unhandled error exeption(${exception.message})`,
      // stack: exception.stack,
    };
    // }

    res.status(errorResponse.statusCode).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
    return null;
  }
}
