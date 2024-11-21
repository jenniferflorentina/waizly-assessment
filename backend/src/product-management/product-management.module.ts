import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProductManagementService } from './core/product-management.service';
import { ProductManagementQueryHandlers } from './infrastructure/query/product-management.query.handler';
import { ProductRepository } from './infrastructure/product.repository';
import ProductManagementHTTPController from './presentation/http/product-management.http.controller';
import { ProductManagementCommandHandlers } from './presentation/bus/command/product-management.command.handler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule,
    HttpModule,
  ],
  controllers: [ProductManagementHTTPController],
  exports: [ProductRepository],
  providers: [
    // Command handlers
    ...ProductManagementCommandHandlers,
    // Query handlers
    ...ProductManagementQueryHandlers,
    ...ProductManagementCommandHandlers,
    // Repositories
    ProductRepository,
    // Services
    PrismaService,
    ProductManagementService,
    ConfigService,
  ],
})
export default class ProductManagementModule {}
