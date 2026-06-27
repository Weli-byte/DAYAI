import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { type Observable, map } from 'rxjs';
import type { Request } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest<Request>();
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp,
        path: req.url,
      })),
    );
  }
}
