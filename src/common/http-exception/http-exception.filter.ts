import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error(
      `Error occurred in ${request.method} ${request.url}`,
      exception,
    );

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : message['message'],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
