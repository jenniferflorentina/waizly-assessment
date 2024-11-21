export class LoginResponse {
  accessToken: string;

  refreshToken: string;

  userId: string;

  email: string;

  firstName: string;

  lastName: string;

  username: string;
  
  public constructor(
    accessToken: string,
    refreshToken: string,
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
  }
}
