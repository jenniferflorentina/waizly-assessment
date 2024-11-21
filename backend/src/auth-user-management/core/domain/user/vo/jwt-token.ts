import * as jwt from 'jsonwebtoken';
import { IValueObject } from 'src/common/interface/value-object.interface';
import { DateVO } from 'src/common/vo/date.vo';

export class JWTTokenVO implements IValueObject {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid JWT token');
    }
    this.value = value;
  }

  static createNew(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    eAt: DateVO,
  ): JWTTokenVO {
    const payload = {
      userId,
      email,
      firstName,
      lastName,
      username,
      eAt,
      iAt: DateVO.now(),
    };
    const secret = 'jwt-token-secret'; // TODO Replace from env
    const token = jwt.sign(payload, secret);
    return new JWTTokenVO(token);
  }

  isValid(value: string): boolean {
    const regex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return regex.test(value);
  }

  public getValue(): string {
    return this.value;
  }

  public decode(): any {
    try {
      const decoded = jwt.decode(this.value);
      if (!decoded || typeof decoded === 'string') {
        throw new Error('Invalid token structure');
      }
      return decoded;
    } catch (error) {
      throw new Error('Failed to decode JWT token');
    }
  }

  public verify(): any {
    try {
      return jwt.verify(this.value, 'jwt-token-secret');
    } catch (error) {
      throw new Error('Failed to verify JWT token');
    }
  }
}
