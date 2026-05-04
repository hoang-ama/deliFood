import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const fallbackConnectionString =
      'postgresql://postgres:postgres@localhost:5432/delifood';
    const envConnectionString = process.env.DATABASE_URL?.trim();

    let connectionString = fallbackConnectionString;
    if (
      envConnectionString &&
      !envConnectionString.includes('${') &&
      !envConnectionString.includes('undefined') &&
      !envConnectionString.includes('null')
    ) {
      try {
        const parsedConnection = new URL(envConnectionString);
        const hasRequiredParts =
          parsedConnection.protocol.startsWith('postgres') &&
          Boolean(parsedConnection.hostname) &&
          Boolean(parsedConnection.username) &&
          Boolean(parsedConnection.password) &&
          parsedConnection.pathname !== '/';

        connectionString = hasRequiredParts
          ? envConnectionString
          : fallbackConnectionString;
      } catch {
        connectionString = fallbackConnectionString;
      }
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
