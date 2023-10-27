import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  GroupAlreadyExists,
  GroupExceptions,
  GroupNotFoundException,
  IllegalArgumentGroupException,
} from './exceptions/group.exceptions';

@Catch(GroupExceptions)
export class GroupHttpExceptionFilter<GroupExceptions>
  implements ExceptionFilter
{
  catch(exception: GroupExceptions, host: ArgumentsHost) {
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

  private getStatusByException(exception: GroupExceptions): HttpStatus {
    switch (exception.constructor) {
      case GroupNotFoundException:
        return HttpStatus.NOT_FOUND;
      case IllegalArgumentGroupException:
        return HttpStatus.BAD_REQUEST;
      case GroupAlreadyExists:
        return HttpStatus.CONFLICT;
    }
    //default
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
