import { IValueObject } from 'src/common/interface/value-object.interface';

export class FailedAttemptsVO implements IValueObject {
  private readonly value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new Error('Invalid failed attempts');
    }
    this.value = value;
  }

  isValid(value: number): boolean {
    return value >= 0;
  }

  public getValue(): number {
    return this.value;
  }

  public increment(): FailedAttemptsVO {
    return new FailedAttemptsVO(this.value + 1);
  }

  public hasReachedFailedLimit(): boolean {
    return this.value >= 5;
  }
}
