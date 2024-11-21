import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorResponse, ErrorType } from '../interface/error-response.abstract';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();

    let status: number;
    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const { message } = exception;

      let errorType: ErrorType;
      switch (status) {
        case HttpStatus.NOT_FOUND:
          errorType = ErrorType.NOT_FOUND;
          break;
        case HttpStatus.BAD_REQUEST:
          errorType = ErrorType.VALIDATION_ERROR;
          break;
        case HttpStatus.UNAUTHORIZED:
          errorType = ErrorType.AUTHENTICATION_ERROR;
          break;
        case HttpStatus.FORBIDDEN:
          errorType = ErrorType.AUTHORIZATION_ERROR;
          break;
        default:
          errorType = ErrorType.INTERNAL_SERVER_ERROR;
      }

      errorResponse = new ErrorResponse(
        exception.name,
        message,
        errorType,
        status,
        (exceptionResponse as any).param || undefined,
      );
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = new ErrorResponse(
        'internal_server_error',
        exception.message,
        ErrorType.INTERNAL_SERVER_ERROR,
        status,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = new ErrorResponse(
        'unexpected_error',
        'An unexpected error occurred',
        ErrorType.INTERNAL_SERVER_ERROR,
        status,
      );
    }

    this.logger.error({
      message: errorResponse.message,
      stack: exception instanceof Error ? exception.stack : null,
    });

    response.status(status).json(errorResponse);
  }
}
