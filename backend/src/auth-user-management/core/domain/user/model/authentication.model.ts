import { Model } from 'src/common/interface/model.abstract';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { EmailVO } from 'src/common/vo/email.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { PasswordVO } from '../../../../../common/vo/password.vo';
import { UsernameVO } from '../../../../../common/vo/username.vo';

export class AuthenticationModel extends Model {
  username: UsernameVO;

  private email: EmailVO;

  private password: PasswordVO;

  constructor(
    username: UsernameVO,
    email: EmailVO,
    password: PasswordVO,
    auditTrail: AuditTrailVO,
  ) {
    super(IdVO.generate(), auditTrail);
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
