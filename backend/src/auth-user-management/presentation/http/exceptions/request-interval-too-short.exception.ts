import { HttpException, HttpStatus } from '@nestjs/common';

export class UserManagementExceptions extends HttpException {
  name: string;

  message: string;

  param: string | object;

  public constructor(name: string, message: string, param: string | object) {
    super({ param }, HttpStatus.BAD_REQUEST);
    this.message = message;
    this.name = name;
  }
}
