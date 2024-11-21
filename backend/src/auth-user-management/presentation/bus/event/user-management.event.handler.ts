import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LoginAttemptFailedEvent,
} from './user-management.event';

@EventsHandler(LoginAttemptFailedEvent)
export class LoginAttemptFailedEventHandler
  implements IEventHandler<LoginAttemptFailedEvent>
{
  private logger = new Logger(LoginAttemptFailedEvent.name);

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async handle({ email, name }: LoginAttemptFailedEvent) {
    try {
      this.logger.log(name);
      this.logger.log(email);
    } catch (e) {
      this.logger.error(e);
    }
  }
}

export const UserManagementEventHandlers = [
  LoginAttemptFailedEventHandler,
];
