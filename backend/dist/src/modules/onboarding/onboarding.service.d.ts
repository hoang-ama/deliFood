import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import type { OnboardTenantDto } from './dto/onboard-tenant.dto';
export declare class OnboardingService {
    private readonly prisma;
    private readonly authService;
    constructor(prisma: PrismaService, authService: AuthService);
    onboard(dto: OnboardTenantDto): Promise<{
        token: string;
        tenant: {
            id: string;
            name: string;
            subdomain: string;
            settings: Prisma.JsonValue;
            createdAt: Date;
        };
        owner: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        restaurant: {
            id: string;
            name: string;
            tenantId: string;
        };
    }>;
}
