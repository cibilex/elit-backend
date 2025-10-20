import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, catchError, map, throwError } from 'rxjs';
import { getIpAddress } from './parser';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();

    return next.handle().pipe(
      map((data: unknown) => this.responseHandler(data, res, req)),
      catchError((err: unknown) =>
        throwError(() => this.errorHandler(err, res, req)),
      ),
    );
  }

  private writeLog(
    req: FastifyRequest,
    res: FastifyReply,
    response: unknown,
    err?: unknown,
  ) {
    const { log, body, url, method, query, params } = req;
    const ip = getIpAddress(req);

    log.info({
      response: err ? response : undefined,
      err,
      reqBody: body,
      url,
      ip,
      // userId: user?.id,
      method,
      responseTime: Math.round(res.elapsedTime),
      query,
      params,
    });
  }

  errorHandler(err: any, res: FastifyReply, req: FastifyRequest) {
    const error =
      err instanceof HttpException ? err : new InternalServerErrorException();

    const response = {
      success: false,
      message: error.message,
    };

    this.writeLog(req, res, response, err);

    res.status(error.getStatus()).send({
      success: false,
      message: error.message,
    });
  }

  private responseHandler(
    data: unknown,
    res: FastifyReply,
    req: FastifyRequest,
  ) {
    this.writeLog(req, res, data);

    return {
      status: res.statusCode,
      success: true,
      data,
    };
  }
}
