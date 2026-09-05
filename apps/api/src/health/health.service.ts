import { Injectable } from '@nestjs/common';
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    let dbStatus = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
      },
    };
  }
}
