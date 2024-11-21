import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { DateVO } from 'src/common/vo/date.vo';
import { UserRepository } from '../infrastructure/user.repository';
import { JWTTokenVO } from './domain/user/vo/jwt-token';
import { LoginResponse } from '../presentation/http/dto/login-response.dto';
import { TokensVO } from './domain/user/vo/tokens.vo';
import { UserBasicModel } from './domain/user/model/user.model';
import { UserAuthModel } from './domain/user/model/user-auth.aggregate';
import { CredentialModel } from './domain/user/model/credential.model';
import { LastFailedAtVO } from './domain/user/vo/last-failed-at.vo';
import { LoginAttemptFailedEvent } from '../presentation/bus/event/user-management.event';
import { IdVO } from 'src/common/vo/id.vo';

@Injectable()
export class UserManagementService {
  private logger: Logger = new Logger(UserManagementService.name);

  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus,
  ) {}

  async registerUser(
    user: UserAuthModel,
  ): Promise<void> {
    await this.userRepository.createUser(user);
  }

  async login(credential: CredentialModel): Promise<LoginResponse> {
    const auth = await this.userRepository.findByEmail(
      credential.getEmail().getValue(),
    );
    if (!auth) {
      throw new BadRequestException('Email is not registered');
    }

    const loginUser = await this.userRepository.findUserByAuthId(
      auth.getId(),
    );

    if (!loginUser) {
      throw new BadRequestException('Login user not found');
    }

    this.logger.log(`Login attempt: ${auth.getFailedAttempts().getValue()}`);

    if (
      auth.getFailedAttempts().hasReachedFailedLimit() &&
      !auth.getLastFailedAt().hasBeenFifteenMinutes()
    ) {
      const timeUntilUnlock = auth.getLastFailedAt().timeUntilUnlock();
      throw new BadRequestException(
        `Too many failed attempts. ${timeUntilUnlock}`,
      );
    }

    if (
      !(await auth
        .getPassword()
        ?.comparePassword(credential.getPassword()?.getPlainValue() || ''))
    ) {
      const failedAttempts = auth.getFailedAttempts().increment();

      await this.userRepository.updateFailedAttempts(
        auth.getId(),
        failedAttempts,
        new LastFailedAtVO(new Date()),
      );

      if (failedAttempts.hasReachedFailedLimit()) {
        await this.eventBus.publish(
          new LoginAttemptFailedEvent(
            auth.getEmail(),
            `${loginUser.getFirstName().getValue()} ${loginUser.getLastName().getValue()}`,
          ),
        );
      }

      throw new BadRequestException('Password is incorrect');
    }

    const tokens = new TokensVO(
      JWTTokenVO.createNew(
        auth.getId().getValue(),
        auth.getEmail().getValue(),
        loginUser.getFirstName().getValue(),
        loginUser.getLastName().getValue(),
        auth.getUsername()?.getValue() || '',
        DateVO.fifteenMinutesFromNow(),
      ),
      JWTTokenVO.createNew(
        auth.getId().getValue(),
        auth.getEmail().getValue(),
        loginUser.getFirstName().getValue(),
        loginUser.getLastName().getValue(),
        auth.getUsername()?.getValue() || '',
        DateVO.twentyFourHoursFromNow(),
      ),
    );

    await this.userRepository.saveRefreshToken(
      auth.getId(),
      tokens.getRefreshToken(),
    );

    return new LoginResponse(
      tokens.getAccessToken()?.getValue() || '',
      tokens.getRefreshToken()?.getValue() || '',
      auth.getId().getValue(),
      auth.getEmail().getValue(),
      loginUser.getFirstName().getValue(),
      loginUser.getLastName().getValue(),
      auth.getUsername()?.getValue() || ''
    );
  }

  async refreshToken(oldRefreshToken: JWTTokenVO): Promise<LoginResponse> {
    if (!oldRefreshToken.verify()) {
      throw new BadRequestException('Invalid refresh token');
    }

    const auth =
      await this.userRepository.findByRefreshToken(oldRefreshToken);

    if (!auth) {
      throw new BadRequestException('Invalid refresh token, auth not found');
    }

    const user = await this.userRepository.findUserByAuthId(
      auth.getId(),
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (oldRefreshToken.getValue() !== auth.getRefreshToken()?.getValue()) {
      throw new BadRequestException('Invalid refresh token');
    }

    const tokens = new TokensVO(
      JWTTokenVO.createNew(
        auth.getId().getValue(),
        auth.getEmail().getValue(),
        user.getFirstName().getValue(),
        user.getLastName().getValue(),
        auth.getUsername()?.getValue() || '',
        DateVO.fifteenMinutesFromNow(),
      ),
      JWTTokenVO.createNew(
        auth.getId().getValue(),
        auth.getEmail().getValue(),
        user.getFirstName().getValue(),
        user.getLastName().getValue(),
        auth.getUsername()?.getValue() || '',
        DateVO.twentyFourHoursFromNow(),
      ),
    );

    await this.userRepository.saveRefreshToken(
      auth.getId(),
      tokens.getRefreshToken(),
    );

    return new LoginResponse(
      tokens.getAccessToken()?.getValue() || '',
      tokens.getRefreshToken()?.getValue() || '',
      auth.getId().getValue(),
      auth.getEmail().getValue(),
      user.getFirstName().getValue(),
      user.getLastName().getValue(),
      auth.getUsername()?.getValue() || '',
    );
  }

  async updateBasicProfile(
    userBasic: UserBasicModel,
  ): Promise<UserBasicModel> {
    const isUpdated = await this.userRepository.updateBasicProfile(userBasic);

    if (!isUpdated) {
      throw new BadRequestException('Failed to update user profile');
    }

    const user = await this.userRepository.findBasicProfileById(
      userBasic.getId(),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  async deleteUser(
    id: IdVO,
  ): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
