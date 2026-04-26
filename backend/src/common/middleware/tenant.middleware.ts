import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const urlPath =
      typeof req.originalUrl === 'string'
        ? req.originalUrl.split('?')[0]
        : '';

    const isPublicOnboarding =
      req.method === 'POST' &&
      (urlPath === '/api/onboarding' ||
        urlPath === '/onboarding' ||
        urlPath.endsWith('/onboarding'));

    if (isPublicOnboarding) {
      next();
      return;
    }

    const host = req.headers.host;
    const subdomainFromHost = host?.split('.')[0];
    const subdomainFromHeader = req.headers['x-tenant-subdomain'];
    const subdomainOverride =
      typeof subdomainFromHeader === 'string' && subdomainFromHeader.trim() !== ''
        ? subdomainFromHeader.trim().toLowerCase()
        : null;
    const subdomain = subdomainOverride ?? subdomainFromHost;

    let tenant;

    if (!subdomain || subdomain === 'localhost') {
      tenant = await this.prisma.tenant.findFirst();
    } else {
      tenant = await this.prisma.tenant.findUnique({
        where: { subdomain },
      });
    }

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    req.tenantId = tenant.id;
    next();
  }
}
