import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    // Các route không cần check tenant-id (ví dụ: onboarding, health check)
    void response;
    const publicRoutes = ['/api/onboarding', '/onboarding', '/api/health', '/health'];
    if (publicRoutes.some(route => request.url.startsWith(route))) {
      return next();
    }

    const tenantIdHeader = (request.headers['tenant-id'] as string | undefined)?.trim();
    const tenantSubdomainHeader = (
      request.headers['x-tenant-subdomain'] as string | undefined
    )
      ?.trim()
      .toLowerCase();

    if (!tenantIdHeader && !tenantSubdomainHeader) {
      // Thay vì throw lỗi ngay, có thể cho phép qua nếu là route public khác
      // Hoặc bắt buộc chặt chẽ cho các route nghiệp vụ
      throw new BadRequestException(
        'Tenant header is missing. Provide tenant-id or x-tenant-subdomain',
      );
    }

    let resolvedTenantId = tenantIdHeader ?? '';

    // Support public storefront requests by subdomain path/header.
    if (!resolvedTenantId || tenantSubdomainHeader) {
      const tenant = await this.prisma.tenant.findFirst({
        where: tenantSubdomainHeader
          ? { subdomain: tenantSubdomainHeader }
          : { id: resolvedTenantId },
        select: { id: true },
      });

      if (!tenant) {
        throw new BadRequestException('Tenant not found');
      }

      resolvedTenantId = tenant.id;
    }

    // Gắn tenantId vào request để các service sau này sử dụng
    request['tenantId'] = resolvedTenantId;
    next();
  }
}
