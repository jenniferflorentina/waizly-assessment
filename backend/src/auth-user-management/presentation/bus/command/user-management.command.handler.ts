import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserManagementService } from 'src/auth-user-management/core/user-management.service';
import {
  LoginCommand,
  RefreshTokenCommand,
  UpdateBasicProfileCommand,
  RegisterUserCommand,
  DeleteUserCommand,
} from './user-management.command';

@CommandHandler(RegisterUserCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    public readonly userManagementService: UserManagementService,
  ) {}

  async execute(command: RegisterUserCommand) {
    return this.userManagementService.registerUser(command.payload);
  }
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(public readonly userManagementService: UserManagementService) {}

  async execute({ credential }: LoginCommand) {
    return this.userManagementService.login(credential);
  }
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(public readonly userManagementService: UserManagementService) {}

  async execute({ oldRefreshToken }: RefreshTokenCommand) {
    return this.userManagementService.refreshToken(oldRefreshToken);
  }
}

@CommandHandler(UpdateBasicProfileCommand)
export class UpdateBasicProfileCommandHandler
  implements ICommandHandler<UpdateBasicProfileCommand>
{
  constructor(public readonly userManagementService: UserManagementService) {}

  async execute({ userBasic }: UpdateBasicProfileCommand) {
    return this.userManagementService.updateBasicProfile(userBasic);
  }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(public readonly userManagementService: UserManagementService) {}

  async execute({ id }: DeleteUserCommand) {
    return this.userManagementService.deleteUser(id);
  }
}

export const UserManagementCommandHandlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
  RefreshTokenCommandHandler,
  UpdateBasicProfileCommandHandler,
  DeleteUserCommandHandler,
];
