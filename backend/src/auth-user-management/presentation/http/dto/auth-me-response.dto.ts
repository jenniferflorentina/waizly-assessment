export class AuthMeResponse {
  userId: string;

  email: string;

  imagePath: string | null;

  firstName: string;

  lastName: string;

  username: string;

  public constructor(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    imagePath: string | null,
  ) {
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.imagePath = imagePath;
  }
}
