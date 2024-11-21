import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthMeResponse } from 'src/auth-user-management/presentation/http/dto/auth-me-response.dto';
import { BadRequestException, Inject } from '@nestjs/common';
import { IdVO } from 'src/common/vo/id.vo';
import { BasicProfileResponse } from 'src/auth-user-management/presentation/http/dto/basic-profile-response.dto';
import {
  GetAuthMeQuery,
  GetUserBasicProfileQuery,
} from './user-management.query';
import { UserRepository } from '../user.repository';

@QueryHandler(GetAuthMeQuery)
export class GetAuthMeQueryHandler implements IQueryHandler<GetAuthMeQuery> {
  constructor(public readonly userRepository: UserRepository) {}


  async execute(query: GetAuthMeQuery): Promise<AuthMeResponse> {
    const { payload } = query;

    const auth = await this.userRepository.findAuthById(payload.getUserId());

    if (!auth) {
      throw new BadRequestException('Email is not registered');
    }

    const user = await this.userRepository.findUserByAuthId(
      new IdVO(payload.getUserId()),
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new AuthMeResponse(
      auth.getId().getValue(),
      auth.getEmail().getValue(),
      user.getFirstName().getValue(),
      user.getLastName().getValue(),
      auth.getUsername()?.getValue() || '',
      user.getImagePath()?.getValue() || '',
    );
  }
}

@QueryHandler(GetUserBasicProfileQuery)
export class GetUserBasicProfileQueryHandler
  implements IQueryHandler<GetUserBasicProfileQuery>
{
  constructor(public readonly userRepository: UserRepository) {}

  async execute(
    query: GetUserBasicProfileQuery,
  ): Promise<BasicProfileResponse> {
    const user = await this.userRepository.findBasicProfileById(
      new IdVO(query.id.getValue()),
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new BasicProfileResponse(
      user.getFirstName().getValue(),
      user.getLastName().getValue(),
      user.getPhoneNumber()?.getCountryCode() || '',
      user.getPhoneNumber()?.getPhoneNumber() || '',
      user.getGender()?.getValue() || '',
      user.getDateOfBirth()?.toString() || '',
    );
  }
}

export const UserManagementQueryHandlers = [
  GetAuthMeQueryHandler,
  GetUserBasicProfileQueryHandler,
];
