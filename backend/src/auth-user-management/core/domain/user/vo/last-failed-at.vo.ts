import { IValueObject } from 'src/common/interface/value-object.interface';

export class LastFailedAtVO implements IValueObject {
  private readonly value: Date | null;

  constructor(value: Date | null) {
    if (!this.isValid(value)) {
      throw new Error('Invalid last failed attempt timestamp');
    }
    this.value = value;
  }

  isValid(value: Date | null): boolean {
    return (
      value === null ||
      (value instanceof Date && value.getTime() <= new Date().getTime())
    );
  }

  public getValue(): Date | null {
    return this.value;
  }

  public hasBeenFifteenMinutes(): boolean {
    if (this.value === null) {
      return true;
    }
    const currentTime = new Date().getTime();
    const lastFailedTime = this.value.getTime();
    const fifteenMinutesInMilliseconds = 15 * 60 * 1000;

    return currentTime - lastFailedTime >= fifteenMinutesInMilliseconds;
  }

  public timeUntilUnlock(): string {
    if (this.value === null) {
      return 'Account is not locked';
    }
    const currentTime = new Date().getTime();
    const lastFailedTime = this.value.getTime();
    const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
    const timeElapsed = currentTime - lastFailedTime;

    if (timeElapsed >= fifteenMinutesInMilliseconds) {
      return 'Account is now unlocked';
    }

    const timeRemaining = fifteenMinutesInMilliseconds - timeElapsed;
    const minutesRemaining = Math.floor(timeRemaining / 60000);
    const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

    return `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''} and ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''} until account unlock`;
  }
}
