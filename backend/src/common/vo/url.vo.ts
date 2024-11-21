import { IValueObject } from '../interface/value-object.interface';

export class UrlVO implements IValueObject {
  private readonly value: string | null;

  constructor(value: string | null) {
    if (!this.isValid(value)) {
      throw new Error(
        `Invalid URL: "${value}". Please provide a valid URL including the protocol (e.g., http:// or https://).`,
      );
    }
    this.value = value;
  }

  isValid(value: string | null): boolean {
    if (value === null) {
      return true;
    }
    if (value === undefined) {
      return true;
    }
    if (value === '') {
      return true;
    }
    try {
      return URL.canParse(value);
    } catch (error) {
      return false;
    }
  }

  public getValue(): string | null {
    return this.value;
  }
}
