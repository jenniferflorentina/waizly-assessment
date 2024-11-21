import * as bcrypt from 'bcrypt';
import { IValueObject } from 'src/common/interface/value-object.interface';

export class PasswordVO implements IValueObject {
  private readonly value: string;

  private readonly plainValue: string;

  constructor(value: string, is_plain: boolean = false) {
    if (!this.isValid(value) && !is_plain) {
      throw new Error(`Invalid password format${value}`);
    }
    if (is_plain) {
      this.value = this.hashPassword(value);
      this.plainValue = value;
    } else {
      this.value = value;
    }
  }

  public static generateNew(value: string): PasswordVO {
    const isValid = (val: string) => {
      const regex =
        /^(?=.*[A-Z])(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}])[a-zA-Z0-9!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}]{8,32}$/;
      return regex.test(val);
    };

    if (!isValid(value)) {
      throw new Error(
        'Invalid password: Password must be 8-32 characters long, contain at least one uppercase letter, and include at least one special character.',
      );
    }
    return new PasswordVO(value, true);
  }

  isValid(value: string): boolean {
    // Check if the value is a valid bcrypt hash
    const bcryptRegex = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
    return bcryptRegex.test(value);
  }

  public getValue(): string {
    return this.value;
  }

  public getPlainValue(): string {
    return this.plainValue;
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  public async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.value);
  }
}
