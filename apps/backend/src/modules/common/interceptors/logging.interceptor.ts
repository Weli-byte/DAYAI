import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { type Observable, tap } from 'rxjs';
import type { Request, Response } from 'express';
import { type AppLogger } from '../../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request & { id?: string }>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = req;
    const requestId = req.id ?? '-';
    const start = Date.now();

    this.logger.log(
      `→ ${method} ${url} [${requestId}] from ${ip ?? 'unknown'}`,
      LoggingInterceptor.name,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          this.logger.log(
            `← ${method} ${url} ${res.statusCode} ${duration}ms [${requestId}]`,
            LoggingInterceptor.name,
          );
        },
        error: (err: Error) => {
          const duration = Date.now() - start;
          this.logger.error(
            `← ${method} ${url} ERROR ${duration}ms [${requestId}]: ${err.message}`,
            err.stack,
            LoggingInterceptor.name,
          );
        },
      }),
    );
  }
}
