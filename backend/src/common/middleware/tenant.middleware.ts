import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    // Các route không cần check tenant-id (ví dụ: onboarding, health check)
    void response;
    const publicRoutes = ['/api/onboarding', '/onboarding', '/api/health', '/health'];
    if (publicRoutes.some(route => request.url.startsWith(route))) {
      return next();
    }

    const tenantId = request.headers['tenant-id'] as string;
    if (!tenantId) {
      // Thay vì throw lỗi ngay, có thể cho phép qua nếu là route public khác
      // Hoặc bắt buộc chặt chẽ cho các route nghiệp vụ
      throw new BadRequestException('X-Tenant-ID header is missing');
    }

    // Gắn tenantId vào request để các service sau này sử dụng
    request['tenantId'] = tenantId;
    next();
  }
}
