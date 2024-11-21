import { IValueObject } from 'src/common/interface/value-object.interface';
import { JWTTokenVO } from './jwt-token';

export class TokensVO implements IValueObject {
  private accessToken: JWTTokenVO;

  private refreshToken: JWTTokenVO;

  constructor(accessToken: JWTTokenVO, refreshToken: JWTTokenVO) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  isValid(): boolean {
    // TODO implement
    return true;
  }
}
