export enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  AUTHORIZATION_ERROR = 'authorization_error',
  NOT_FOUND = 'not_found',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  // Add more as needed
}

// Example usage
// const errorResponse = new ErrorResponse(
//   'invalid_email',
//   'The email address provided is invalid.',
//   ErrorType.VALIDATION_ERROR,
//   400,
//   'email'
// );
export class ErrorResponse {
  status: string;

  message: string;

  type: ErrorType;

  errors?: string | object | undefined;

  code: number;

  constructor(
    status: string,
    message: string,
    type: ErrorType,
    code: number,
    errors?: string | object | any,
  ) {
    this.code = code;
    this.message = message;
    this.type = type;
    this.status = status;
    this.errors = errors;
  }
}
