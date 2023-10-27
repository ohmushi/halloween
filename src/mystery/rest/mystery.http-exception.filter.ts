import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  InvalidMysteryException,
  MysteryException,
  MysteryNotFoundException,
} from '../exceptions/mystery.exeptions';
import { Request, Response } from 'express';

@Catch(MysteryException)
export class MysteryHttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: MysteryException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatusByException(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getStatusByException(exception: MysteryException): HttpStatus {
    switch (exception.constructor) {
      case MysteryNotFoundException:
        return HttpStatus.NOT_FOUND;
      case InvalidMysteryException:
        return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
