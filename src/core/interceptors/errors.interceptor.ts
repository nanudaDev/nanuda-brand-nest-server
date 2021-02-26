import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  BadRequestException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        // if (err && err instanceof Error) {
        //   console.log(err);
        //   console.log('err.name', err.name);
        //   console.log('err.message', err.message);
        //   return throwError(new BadRequestException());
        // }
        return throwError(err);
      }),
    );
  }
}
