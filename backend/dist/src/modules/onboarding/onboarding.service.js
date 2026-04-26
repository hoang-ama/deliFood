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
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
let OnboardingService = class OnboardingService {
    prisma;
    authService;
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async onboard(dto) {
        const subdomain = dto.tenant.subdomain.trim().toLowerCase();
        const email = dto.owner.email.trim().toLowerCase();
        try {
            return await this.prisma.$transaction(async (tx) => {
                const settings = dto.configuration !== undefined && dto.configuration !== null
                    ? dto.configuration
                    : {};
                const tenant = await tx.tenant.create({
                    data: {
                        name: dto.tenant.name.trim(),
                        subdomain,
                        settings,
                    },
                });
                const owner = await tx.user.create({
                    data: {
                        email,
                        password: this.authService.hashPassword(dto.owner.password),
                        role: 'owner',
                        tenantId: tenant.id,
                    },
                });
                const restaurant = await tx.restaurant.create({
                    data: {
                        name: dto.restaurant.name.trim(),
                        tenantId: tenant.id,
                    },
                });
                const token = await this.authService.issueAccessToken(owner);
                return {
                    token,
                    tenant: {
                        id: tenant.id,
                        name: tenant.name,
                        subdomain: tenant.subdomain,
                        settings: tenant.settings,
                        createdAt: tenant.createdAt,
                    },
                    owner: {
                        id: owner.id,
                        email: owner.email,
                        role: owner.role,
                    },
                    restaurant: {
                        id: restaurant.id,
                        name: restaurant.name,
                        tenantId: restaurant.tenantId,
                    },
                };
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002') {
                throw new common_1.ConflictException('This subdomain or email is already registered for an existing workspace');
            }
            throw e;
        }
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map