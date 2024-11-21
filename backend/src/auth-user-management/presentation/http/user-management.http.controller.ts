import {
  Get,
  Body,
  Controller,
  Param,
  Post,
  Put,
  Request,
  ForbiddenException,
  Delete,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { EmailVO } from 'src/common/vo/email.vo';
import { PhoneNumberVO } from 'src/common/vo/phone-number.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';
import { CredentialModel } from 'src/auth-user-management/core/domain/user/model/credential.model';
import { FirstNameVO } from 'src/auth-user-management/core/domain/user/vo/first-name.vo';
import { PasswordVO } from 'src/common/vo/password.vo';
import { UsernameVO } from 'src/common/vo/username.vo';
import { GenderVO } from 'src/common/vo/gender.vo';
import { DateVO } from 'src/common/vo/date.vo';
import { IdVO } from 'src/common/vo/id.vo';
import { FailedAttemptsVO } from 'src/auth-user-management/core/domain/user/vo/failed-attempts.vo';
import { LastFailedAtVO } from 'src/auth-user-management/core/domain/user/vo/last-failed-at.vo';
import { BaseResponse } from 'src/common/interface/response.abstract';
import {
  GetAuthMeQuery,
  GetUserBasicProfileQuery,
} from 'src/auth-user-management/infrastructure/query/user-management.query';
import { JWTTokenVO } from 'src/auth-user-management/core/domain/user/vo/jwt-token';
import { UserBasicModel } from 'src/auth-user-management/core/domain/user/model/user.model';
import { PhoneCodeVO } from 'src/common/vo/phone-code.vo';
import {
  RegisterUserCommand,
  LoginCommand,
  RefreshTokenCommand,
  UpdateBasicProfileCommand,
  DeleteUserCommand,
} from '../bus/command/user-management.command';
import {
  RegisterDTO,
} from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';
import { AuthMeResponse } from './dto/auth-me-response.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { BasicProfileResponse } from './dto/basic-profile-response.dto';
import { UpdateBasicProfileDTO } from './dto/update-basic-profile.dto';
import { UserAuthModel } from 'src/auth-user-management/core/domain/user/model/user-auth.aggregate';

@Controller('/user-management')
export default class UserManagementHTTPController {
  private readonly logger = new Logger(UserManagementHTTPController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/register')
  async register(
    @Request() req: any,
    @Body() dto: RegisterDTO,
  ): Promise<BaseResponse<LoginResponse>> {
    const id = IdVO.generate();
    const auditTrail = AuditTrailVO.createEmpty();

    return new BaseResponse(
      await this.commandBus.execute(
        new RegisterUserCommand(
          new UserAuthModel(
            id,
            new FirstNameVO(dto.firstName),
            new ShortNameVO(dto.lastName),
            new GenderVO(dto.gender),
            new DateVO(dto.dateOfBirth),
            new PhoneNumberVO(dto.phoneCode, dto.phoneNumber),
            new CredentialModel(
              id,
              new UsernameVO(dto.username),
              new EmailVO(dto.email),
              PasswordVO.generateNew(dto.password),
              null,
              new FailedAttemptsVO(0),
              new LastFailedAtVO(null),
              auditTrail,
            ),
            auditTrail,
          ),
        ),
      ),
    );
  }

  @Post('/auth/login')
  async login(@Body() dto: LoginDTO): Promise<BaseResponse<LoginResponse>> {
    const auditTrail = AuditTrailVO.createEmpty();

    return new BaseResponse(
      await this.commandBus.execute(
        new LoginCommand(
          new CredentialModel(
            IdVO.generate(),
            null,
            new EmailVO(dto.email),
            PasswordVO.generateNew(dto.password),
            null,
            new FailedAttemptsVO(0),
            new LastFailedAtVO(null),
            auditTrail,
          ),
        ),
      ),
    );
  }

  @Get('/auth/me')
  async authMe(@Request() req: any): Promise<BaseResponse<AuthMeResponse>> {
    const { jwtPayload } = req;

    const authMeResult = await this.queryBus.execute(
      new GetAuthMeQuery(jwtPayload),
    );

    return new BaseResponse(authMeResult);
  }

  @Delete('/auth/delete-account')
  async deleteAccount(
    @Request() req: any,
  ): Promise<BaseResponse<null>> {
    const { jwtPayload } = req;

    await this.commandBus.execute(
      new DeleteUserCommand(new IdVO(jwtPayload.userId)),
    );

    return new BaseResponse();
  }

  @Post('/auth/refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenDTO,
  ): Promise<BaseResponse<LoginResponse>> {
    return new BaseResponse(
      await this.commandBus.execute(
        new RefreshTokenCommand(new JWTTokenVO(dto.refreshToken)),
      ),
    );
  }

  @Get('/users/:id/basic-profile')
  async getUserBasicProfile(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<BaseResponse<BasicProfileResponse>> {
    const { jwtPayload } = req;

    if (jwtPayload.userId !== id) {
      throw new ForbiddenException(
        'Access denied: User ID does not match the requested profile ID',
      );
    }

    const user = await this.queryBus.execute(
      new GetUserBasicProfileQuery(new IdVO(id)),
    );

    return new BaseResponse(user);
  }

  @Put('/users/:id/basic-profile')
  async updateBasicProfile(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateBasicProfileDTO,
  ): Promise<BaseResponse<BasicProfileResponse>> {
    const { jwtPayload } = req;

    if (jwtPayload.userId !== id) {
      throw new ForbiddenException(
        'Access denied: User ID does not match the requested profile ID',
      );
    }

    return new BaseResponse(
      await this.commandBus.execute(
        new UpdateBasicProfileCommand(
          new UserBasicModel(
            new IdVO(id),
            new FirstNameVO(dto.firstName),
            new ShortNameVO(dto.lastName),
            new PhoneNumberVO(dto.phoneCode, dto.phoneNumber),
            new GenderVO(dto.gender),
            new DateVO(dto.dateOfBirth),
            AuditTrailVO.createEmpty(),
          ),
        ),
      ),
    );
  }
}