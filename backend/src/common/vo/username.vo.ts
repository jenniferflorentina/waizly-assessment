import { IValueObject } from 'src/common/interface/value-object.interface';

export class UsernameVO implements IValueObject {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid username');
    }
    this.value = value;
  }

  isValid(value: string): boolean {
    const regex = /^[a-zA-Z0-9._]{6,30}$/;
    return regex.test(value);
  }

  public getValue(): string {
    return this.value;
  }
}
