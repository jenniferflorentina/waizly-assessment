import { IdVO } from 'src/common/vo/id.vo';
import { JwtPayloadVO } from 'src/common/vo/jwt-payload.vo';

export class GetAuthMeQuery {
  constructor(public readonly payload: JwtPayloadVO) {}
}

export class GetUserBasicProfileQuery {
  constructor(public readonly id: IdVO) {}
}