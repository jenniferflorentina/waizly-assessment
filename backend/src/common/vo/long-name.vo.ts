import { IValueObject } from '../interface/value-object.interface';

export class LongNameVO implements IValueObject {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid long name');
    }
    this.value = value;
  }

  isValid(value: string): boolean {
    if (value === null) {
      return true;
    }

    return value.length <= 255;
  }

  public getValue(): string {
    return this.value;
  }
}
