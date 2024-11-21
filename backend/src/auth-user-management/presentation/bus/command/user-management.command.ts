import { EmailVO } from 'src/common/vo/email.vo';
import { PasswordVO } from 'src/common/vo/password.vo';
import { CredentialModel } from 'src/auth-user-management/core/domain/user/model/credential.model';
import { JWTTokenVO } from 'src/auth-user-management/core/domain/user/vo/jwt-token';
import { UserBasicModel } from 'src/auth-user-management/core/domain/user/model/user.model';
import { IdVO } from 'src/common/vo/id.vo';
import { UserAuthModel } from 'src/auth-user-management/core/domain/user/model/user-auth.aggregate';


export class RegisterUserCommand {
  constructor(public readonly payload: UserAuthModel) {}
}

export class LoginCommand {
  constructor(public readonly credential: CredentialModel) {}
}

export class RefreshTokenCommand {
  constructor(public readonly oldRefreshToken: JWTTokenVO) {}
}

export class UpdateBasicProfileCommand {
  constructor(public readonly userBasic: UserBasicModel) {}
}

export class DeleteUserCommand {
  constructor(public readonly id: IdVO) {}
}
