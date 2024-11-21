export class BaseResponse<T> {
  code: number;

  message: string;

  data?: T;

  status: string;

  constructor(
    data?: T,
    code: number = 200,
    message: string = 'Success',
    status: string = 'OK',
  ) {
    this.code = code;
    this.message = message;
    this.status = status;
    this.data = data;
  }
}
