"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TenantMiddleware = class TenantMiddleware {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async use(request, response, next) {
        void response;
        const publicRoutes = ['/api/onboarding', '/onboarding', '/api/health', '/health'];
        if (publicRoutes.some(route => request.url.startsWith(route))) {
            return next();
        }
        const tenantIdHeader = request.headers['tenant-id']?.trim();
        const tenantSubdomainHeader = request.headers['x-tenant-subdomain']
            ?.trim()
            .toLowerCase();
        if (!tenantIdHeader && !tenantSubdomainHeader) {
            throw new common_1.BadRequestException('Tenant header is missing. Provide tenant-id or x-tenant-subdomain');
        }
        let resolvedTenantId = tenantIdHeader ?? '';
        if (!resolvedTenantId || tenantSubdomainHeader) {
            const tenant = await this.prisma.tenant.findFirst({
                where: tenantSubdomainHeader
                    ? { subdomain: tenantSubdomainHeader }
                    : { id: resolvedTenantId },
                select: { id: true },
            });
            if (!tenant) {
                throw new common_1.BadRequestException('Tenant not found');
            }
            resolvedTenantId = tenant.id;
        }
        request['tenantId'] = resolvedTenantId;
        next();
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map