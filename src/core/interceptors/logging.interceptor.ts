import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextName = context.getClass().name;
    Logger.debug('Before...', contextName);

    const req = context.switchToHttp().getRequest();

    // req 가 있으면 rest 요청이고, req 가 없으면 graphql 요청이다.
    if (req) {
      Logger.debug(`${req.method} ${req.originalUrl}`, contextName);
      Logger.debug(`ip: ${req.ip}`, contextName);
      Logger.debug(`params: ${JSON.stringify(req.params)}`, contextName);
      Logger.debug(`query: ${JSON.stringify(req.query)}`, contextName);
      Logger.debug(`body: ${JSON.stringify(req.body)}`, contextName);
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => Logger.debug(`After... ${Date.now() - now}ms`, contextName)),
      );
  }
}
