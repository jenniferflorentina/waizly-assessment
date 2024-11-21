import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { IdVO } from 'src/common/vo/id.vo';
import { EmailVO } from 'src/common/vo/email.vo';
import { AuditTrailVO } from 'src/common/vo/audit-trail.vo';
import { ShortNameVO } from 'src/common/vo/short-name.vo';
import { PhoneCodeVO } from 'src/common/vo/phone-code.vo';
import { PhoneNumberVO } from 'src/common/vo/phone-number.vo';
import { CredentialModel } from '../core/domain/user/model/credential.model';
import { UsernameVO } from '../../common/vo/username.vo';
import { FailedAttemptsVO } from '../core/domain/user/vo/failed-attempts.vo';
import { JWTTokenVO } from '../core/domain/user/vo/jwt-token';
import { LastFailedAtVO } from '../core/domain/user/vo/last-failed-at.vo';
import { PasswordVO } from '../../common/vo/password.vo';
import { UserBasicModel } from '../core/domain/user/model/user.model';
import { FirstNameVO } from '../core/domain/user/vo/first-name.vo';
import { UserAuthModel } from '../core/domain/user/model/user-auth.aggregate';
import { UrlVO } from 'src/common/vo/url.vo';
import { GenderVO } from 'src/common/vo/gender.vo';
import { DateVO } from 'src/common/vo/date.vo';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async createUser(
    userModel: UserAuthModel,
  ): Promise<void> {
    // Add username and password to auth
    await this.txHost.tx.authentications.create({
      data: {
        id: userModel.getId().getValue(),
        email: userModel.getCredentials().getEmail().getValue(),
        username: userModel.getCredentials().getUsername()?.getValue() ?? '',
        password: userModel.getCredentials().getPassword()?.getValue() ?? '',
        created_at: userModel.getAuditTrail().getCreatedAt(),
        updated_at: userModel.getAuditTrail().getUpdatedAt(),
      },
    });

    // Create user
    await this.txHost.tx.users.create({
      data: {
        id: userModel.getId().getValue(),
        auth_id: userModel.getId().getValue(),
        first_name: userModel.getFirstName().getValue(),
        last_name: userModel.getLastName().getValue(),
        gender: userModel.getGender().getValue(),
        phone_code: userModel.getPhoneNumber()?.getCountryCode() ?? null,
        phone_number:
          userModel.getPhoneNumber()?.getPhoneNumber() ?? null,
        date_of_birth: userModel.getDateOfBirth().getValue(),
        created_at: userModel.getAuditTrail().getCreatedAt(),
        updated_at: userModel.getAuditTrail().getUpdatedAt(),
      },
    });
  }

  async findByEmail(email: string): Promise<CredentialModel | null> {
    const auth = await this.txHost.tx.authentications.findFirst({
      where: { email,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    if (!auth) {
      return null;
    }

    return new CredentialModel(
      new IdVO(auth.id),
      auth.username ? new UsernameVO(auth.username) : null,
      new EmailVO(auth.email),
      new PasswordVO(auth.password),
      auth.refresh_token ? new JWTTokenVO(auth.refresh_token) : null,
      new FailedAttemptsVO(auth.failed_attempts ?? 0),
      new LastFailedAtVO(auth.last_failed_at),
      new AuditTrailVO(
        auth.created_at,
        new IdVO(auth.id),
        auth.updated_at,
        null,
      ),
    );
  }

  async deleteUser(id: IdVO): Promise<void> {
    const existingAuth = await this.txHost.tx.authentications.findFirst({
      where: { 
        id: id.getValue(),
        deleted_at: null,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    if (!existingAuth){
      throw new NotFoundException('User not found');
    }

    await this.txHost.tx.authentications.update({
      where: { id: id.getValue() },
      data:{
        email: "DELETED"+existingAuth.email,
        deleted_at: new Date(), 
      }
    });

    await this.txHost.tx.users.update({
      where: { id: id.getValue() },
      data:{
        deleted_at: new Date(), 
      }
    });
  }

  async findAuthById(id: string): Promise<CredentialModel | null> {
    const auth = await this.txHost.tx.authentications.findUnique({
      where: { id },
    });

    if (!auth) {
      return null;
    }

    return new CredentialModel(
      new IdVO(auth.id),
      auth.username ? new UsernameVO(auth.username) : null,
      new EmailVO(auth.email),
      new PasswordVO(auth.password),
      auth.refresh_token ? new JWTTokenVO(auth.refresh_token) : null,
      new FailedAttemptsVO(auth.failed_attempts ?? 0),
      new LastFailedAtVO(auth.last_failed_at),
      new AuditTrailVO(
        auth.created_at,
        new IdVO(auth.id),
        auth.updated_at,
        null,
      ),
    );
  }


  async findUserByAuthId(authId: IdVO): Promise<UserBasicModel | null> {
    const user = await this.txHost.tx.users.findFirst({
      where: {
        auth_id: authId.getValue(),
        deleted_at: null,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    if (!user) {
      return null;
    }

    return new UserBasicModel(
      new IdVO(user.id),
      new FirstNameVO(user.first_name),
      new ShortNameVO(user.last_name),
      user.phone_number ? new PhoneNumberVO(user.phone_code, user.phone_number) : null,
      user.gender ? new GenderVO(user.gender) : null,
      user.date_of_birth ? new DateVO(user.date_of_birth.toISOString()) : null,
      AuditTrailVO.createEmpty(),
      user.image_path ? new UrlVO(user.image_path) : null,
    );
  }

  async updateFailedAttempts(
    id: IdVO,
    failedAttempts: FailedAttemptsVO,
    lastFailedAt: LastFailedAtVO,
  ): Promise<void> {
    await this.txHost.tx.authentications.update({
      where: { id: id.getValue() },
      data: {
        failed_attempts: failedAttempts.getValue(),
        last_failed_at: lastFailedAt.getValue() ?? undefined,
      },
    });
  }

  async saveRefreshToken(id: IdVO, refreshToken: JWTTokenVO): Promise<void> {
    await this.txHost.tx.authentications.update({
      where: { id: id.getValue() },
      data: {
        refresh_token: refreshToken.getValue(),
      },
    });
  }

  async findByRefreshToken(
    refreshToken: JWTTokenVO,
  ): Promise<CredentialModel | null> {
    const auth = await this.txHost.tx.authentications.findFirst({
      where: { refresh_token: refreshToken.getValue() },
    });

    if (!auth) {
      return null;
    }

    return new CredentialModel(
      new IdVO(auth.id),
      auth.username ? new UsernameVO(auth.username) : null,
      new EmailVO(auth.email),
      new PasswordVO(auth.password),
      auth.refresh_token ? new JWTTokenVO(auth.refresh_token) : null,
      new FailedAttemptsVO(auth.failed_attempts ?? 0),
      new LastFailedAtVO(auth.last_failed_at),
      new AuditTrailVO(
        auth.created_at,
        new IdVO(auth.id),
        auth.updated_at,
        null,
      ),
    );
  }

  async findBasicProfileById(id: IdVO): Promise<UserBasicModel | null> {
    const user = await this.txHost.tx.users.findFirst({
      where: { id: id.getValue() },
    });

    if (!user) {
      return null;
    }

    return new UserBasicModel(
      new IdVO(user.id),
      new FirstNameVO(user.first_name),
      new ShortNameVO(user.last_name),
      user.phone_number ? new PhoneNumberVO(user.phone_code, user.phone_number) : null,
      user.gender ? new GenderVO(user.gender) : null,
      user.date_of_birth ? new DateVO(user.date_of_birth.toISOString()) : null,
      AuditTrailVO.createEmpty(),
      user.image_path ? new UrlVO(user.image_path) : null,
    );
  }

  async updateBasicProfile(user: UserBasicModel): Promise<boolean> {
    const updateUser = await this.txHost.tx.users.update({
      where: { id: user.getId().getValue() },
      data: {
        first_name: user.getFirstName().getValue(),
        last_name: user.getLastName().getValue(),
        phone_code: user.getPhoneNumber()?.getCountryCode() || null,
        phone_number: user.getPhoneNumber()?.getPhoneNumber() || null,
        gender: user.getGender()?.getValue() || null,
        date_of_birth: user.getDateOfBirth()?.getValue() || null,
        updated_at: new Date(),
      },
    });

    return !!(updateUser);
  }
}
