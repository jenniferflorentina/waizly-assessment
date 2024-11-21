import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { ResilienceModule } from 'nestjs-resilience';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaModule } from './common/prisma/prisma.module';
import { PrismaService } from './common/prisma/prisma.service';
import { HealthModule } from './health/health.module';
import configurations from './config/configurations';
import UserManagementModule from './auth-user-management/user-management.module';
import { JwtDecodeMiddleware } from './common/middleware/jwt-decode.middleware';
import ProductManagementModule from './product-management/product-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    WinstonModule.forRoot({ transports: new winston.transports.Console() }),
    ClsModule.forRoot({
      // https://medium.com/@jedirichang/nestjs-prisma-transaction-with-repositories-2803e5a5487a
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
      global: true,
      middleware: { mount: true },
    }),
    HealthModule,
    UserManagementModule,
    ProductManagementModule,
    ResilienceModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export default class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtDecodeMiddleware)
      .exclude(
        {
          path: 'user-management/auth/login',
          method: RequestMethod.POST,
        },
        { path: 'user-management/register', method: RequestMethod.POST },
        {
          path: 'user-management/auth/reset-password',
          method: RequestMethod.POST,
        },
        {
          path: 'user-management/auth/reset-password/verify',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*'); // Apply to all routes, or specify particular controllers/routes
  }
}
