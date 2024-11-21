import { Model } from 'src/common/interface/model.abstract';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { EmailVO } from 'src/common/vo/email.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { UsernameVO } from '../../../../../common/vo/username.vo';
import { PasswordVO } from '../../../../../common/vo/password.vo';
import { JWTTokenVO } from '../vo/jwt-token';
import { FailedAttemptsVO } from '../vo/failed-attempts.vo';
import { LastFailedAtVO } from '../vo/last-failed-at.vo';

export class CredentialModel extends Model {
  private username: UsernameVO | null;

  private email: EmailVO;

  private password: PasswordVO | null;

  private refreshToken: JWTTokenVO | null;

  private failedAttempts: FailedAttemptsVO;

  private lastFailedAt: LastFailedAtVO;

  constructor(
    id: IdVO,
    username: UsernameVO | null,
    email: EmailVO,
    password: PasswordVO | null,
    refreshToken: JWTTokenVO | null,
    failedAttempts: FailedAttemptsVO,
    lastFailedAt: LastFailedAtVO,
    auditTrail: AuditTrailVO,
  ) {
    super(id, auditTrail);
    this.username = username;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
    this.failedAttempts = failedAttempts;
    this.lastFailedAt = lastFailedAt;
  }

  getUsername(): UsernameVO | null {
    return this.username;
  }

  getEmail(): EmailVO {
    return this.email;
  }

  getPassword(): PasswordVO | null {
    return this.password;
  }

  getRefreshToken(): JWTTokenVO | null {
    return this.refreshToken;
  }

  getFailedAttempts(): FailedAttemptsVO {
    return this.failedAttempts;
  }

  getLastFailedAt(): LastFailedAtVO {
    return this.lastFailedAt;
  }

  setPassword(password: PasswordVO | null) {
    this.password = password;
  }

  setFailedAttempts(failedAttempts: FailedAttemptsVO) {
    this.failedAttempts = failedAttempts;
  }

  setLastFailedAt(lastFailedAt: LastFailedAtVO) {
    this.lastFailedAt = lastFailedAt;
  }

  setEmail(email: EmailVO) {
    this.email = email;
  }
}
