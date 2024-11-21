import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { WinstonModule } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    @Inject(WinstonModule) private readonly logger: LoggerService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    this.logger.error('TEST ERROR LOG');
    return this.health.check([
      () => this.http.pingCheck('http', 'https://google.com'),
      () => this.db.pingCheck('database', this.prisma),
    ]);
  }
}
