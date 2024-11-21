import { GenderEnum } from '../enums/gender.enum';
import { IValueObject } from '../interface/value-object.interface';

export class GenderVO implements IValueObject {
  private readonly value: GenderEnum;

  constructor(gender: string) {
    if (!this.isValid(gender)) {
      throw new Error(
        `Invalid gender: ${gender}. Valid options are: ${Object.values(GenderEnum).join(', ')}`,
      );
    }
    this.value = gender as GenderEnum;
  }

  isValid(gender: string): boolean {
    return Object.values(GenderEnum).includes(gender as GenderEnum);
  }

  public getValue(): GenderEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
