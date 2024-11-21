import { IValueObject } from '../interface/value-object.interface';

export class DateVO implements IValueObject {
  private readonly value: Date;

  constructor(date: string) {
    if (!this.isValid(date) && !this.isValidDateTime(date)) {
      throw new Error(
        'Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD HH:mm:ss',
      );
    }
    this.value = new Date(date);
  }

  isValid(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;

    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getDate() === day
    );
  }

  isValidDateTime(datetime: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!regex.test(datetime)) return false;

    const [datePart, timePart] = datetime.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getDate() === day &&
      dateObj.getHours() === hours &&
      dateObj.getMinutes() === minutes &&
      dateObj.getSeconds() === seconds
    );
  }

  public static now(): DateVO {
    return new DateVO(new Date().toISOString().split('T')[0]);
  }

  public static fifteenMinutesFromNow(): DateVO {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15);
    return new DateVO(date.toISOString().split('T')[0]);
  }

  public static twentyFourHoursFromNow(): DateVO {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return new DateVO(date.toISOString().split('T')[0]);
  }

  public getValue(): Date {
    return this.value;
  }

  public toString(): string {
    return this.value.toISOString().split('T')[0];
  }

  public static oneYearFromNow() {
    const date = new Date();
    date.setHours(date.getHours() + 24 * 365);
    return new DateVO(date.toISOString().split('T')[0]);
  }
}
