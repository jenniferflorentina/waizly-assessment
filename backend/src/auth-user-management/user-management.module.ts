import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserManagementService } from './core/user-management.service';
import { UserManagementQueryHandlers } from './infrastructure/query/user-management.query.handler';
import { UserRepository } from './infrastructure/user.repository';
import { UserManagementCommandHandlers } from './presentation/bus/command/user-management.command.handler';
import { UserManagementEventHandlers } from './presentation/bus/event/user-management.event.handler';
import UserManagementHTTPController from './presentation/http/user-management.http.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule,
    HttpModule,
  ],
  controllers: [UserManagementHTTPController],
  exports: [UserRepository],
  providers: [
    // Command handlers
    ...UserManagementCommandHandlers,
    // Query handlers
    ...UserManagementQueryHandlers,
    ...UserManagementEventHandlers,
    // Repositories
    UserRepository,
    // Services
    PrismaService,
    UserManagementService,
    ConfigService,
  ],
})
export default class UserManagementModule {}
