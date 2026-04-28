import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract tenantId from the request object
 * populated by the TenantMiddleware.
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['tenantId'];
  },
);