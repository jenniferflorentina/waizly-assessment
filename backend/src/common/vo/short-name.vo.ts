import { IValueObject } from '../interface/value-object.interface';

export class ShortNameVO implements IValueObject {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid short name: ${value}`);
    }
    this.value = value;
  }

  isValid(value: string): boolean {
    if (value === null) {
      return true;
    }

    const regex = /^[a-zA-Z' -]{1,40}$/;
    return regex.test(value);
  }

  public getValue(): string {
    return this.value;
  }
}
