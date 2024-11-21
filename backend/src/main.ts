import './opentelemetry';
//
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import AppModule from './app.module';
import { AllExceptionsFilter } from './common/logger/all-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/webhooks/subscriptions',
    bodyParser.raw({ type: 'application/json' }), // Ensures the raw body is used for Stripe signature verification
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const origins = configService.get<string>('CORS_ORIGINS')?.split(',') || [];
  const methods =
    configService.get<string>('CORS_METHODS') ||
    'GET,POST,PUT,DELETE,PATCH,OPTIONS';
  const allowedHeaders =
    configService.get<string>('CORS_ALLOWED_HEADERS') || '*';

  app.enableCors({
    origin: origins,
    methods,
    allowedHeaders,
  });

  await app.listen(3000);
}
bootstrap();
