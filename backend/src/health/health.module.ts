import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [PrismaService, WinstonModule],
  controllers: [HealthController],
})
export class HealthModule {}
