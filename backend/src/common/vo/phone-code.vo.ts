import { IValueObject } from 'src/common/interface/value-object.interface';

export class PhoneCodeVO implements IValueObject {
  private value: string;

  constructor(value: string) {
    this.value = value;

    if (!this.isValid()) {
      throw new Error(`Invalid phone code: ${value}`);
    }
  }

  public isValid(): boolean {
    return (
      this.value !== null &&
      this.value !== undefined &&
      /^\+\d{1,4}$/.test(this.value)
    );
  }

  public getValue(): string {
    return this.value;
  }
}
