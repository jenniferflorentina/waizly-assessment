import { IValueObject } from '../interface/value-object.interface';

export class JwtPayloadVO implements IValueObject {
  private readonly userId: string;

  private readonly email: string;

  private readonly firstName: string;

  private readonly lastName: string;

  private readonly username: string;

  private readonly eAt: Date;

  private readonly iAt: Date;

  constructor(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    eAt: Date,
    iAt: Date,
  ) {
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.eAt = eAt;
    this.iAt = iAt;

    this.isValid();
  }

  public isValid(): boolean {
    // TODO implement this
    return true;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getEmail(): string {
    return this.email;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getUsername(): string {
    return this.username;
  }

  public getEAt(): Date {
    return this.eAt;
  }

  public getIAt(): Date {
    return this.iAt;
  }
}
