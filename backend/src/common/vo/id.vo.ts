import { ulid } from 'ulid';
import { IValueObject } from '../interface/value-object.interface';

export class IdVO implements IValueObject {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid ID: ${value}`);
    }
    this.value = value;
  }

  public static generate(seedTime: number = new Date().getTime()): IdVO {
    return new IdVO(ulid(seedTime));
  }

  public getValue(): string {
    return this.value;
  }

  isValid(seedTime: number | string | null): boolean {
    if (seedTime === null) {
      return true;
    }
    if (typeof seedTime === 'string') {
      // Check if it's a valid ULID
      const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
      return ulidRegex.test(seedTime);
    }
    if (typeof seedTime === 'number') {
      // Check if it's a valid timestamp
      const now = Date.now();
      const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
      return seedTime > oneYearAgo && seedTime <= now;
    }
    return false;
  }
}
