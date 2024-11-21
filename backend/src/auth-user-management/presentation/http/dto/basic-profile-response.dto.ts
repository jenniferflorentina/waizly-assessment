export class BasicProfileResponse {
  firstName: string;

  lastName: string;

  phoneCode: string;

  phoneNumber: string;

  gender: string;

  dateOfBirth: string;

  public constructor(
    firstName: string,
    lastName: string,
    phoneCode: string,
    phoneNumber: string,
    gender: string,
    dateOfBirth: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.phoneCode = phoneCode;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
  }
}
