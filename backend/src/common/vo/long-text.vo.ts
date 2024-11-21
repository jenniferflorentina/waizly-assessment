import { IValueObject } from '../interface/value-object.interface';

export class LongTextVO implements IValueObject {
  private readonly value: string | null;

  constructor(value: string | null) {
    this.value = value;
  }

  // Unused
  isValid(): boolean {
    return true;
  }

  public getValue(): string | null {
    return this.value;
  }
}
