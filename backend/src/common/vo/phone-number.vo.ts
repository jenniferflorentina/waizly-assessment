import { IValueObject } from '../interface/value-object.interface';

export class PhoneNumberVO implements IValueObject {
  private readonly countryCode: string | null;

  private readonly phoneNumber: string | null;

  constructor(countryCode: string | null, phoneNumber: string | null) {
    this.countryCode = countryCode;
    this.phoneNumber = phoneNumber;

    if (!this.isValid()) {
      throw new Error(
        `Invalid phone number: ${JSON.stringify({ countryCode, phoneNumber })}`,
      );
    }
  }

  public isValid(): boolean {
    if (this.countryCode === null && this.phoneNumber === null) {
      return true;
    }

    const countryCodePattern = /^\+[0-9]{1,3}$/;
    const phoneNumberPattern = /^[0-9]{7,15}$/;

    return (
      typeof this.countryCode === 'string' &&
      countryCodePattern.test(this.countryCode) &&
      typeof this.phoneNumber === 'string' &&
      phoneNumberPattern.test(this.phoneNumber)
    );
  }

  public getCountryCode(): string | null {
    return this.countryCode;
  }

  public getPhoneNumber(): string | null {
    return this.phoneNumber;
  }
}
