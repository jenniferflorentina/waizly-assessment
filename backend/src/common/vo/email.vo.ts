import { IValueObject } from '../interface/value-object.interface';

export class EmailVO implements IValueObject {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email address');
    }
    this.value = value;
  }

  isValid(value: string): boolean {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(value);
  }

  public getValue(): string {
    return this.value;
  }
}
