import { EmailVO } from 'src/common/vo/email.vo';

export class LoginAttemptFailedEvent {
  constructor(
    public readonly email: EmailVO,
    public readonly name: string,
  ) {}
}
