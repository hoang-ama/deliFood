import { OnboardTenantDto } from './dto/onboard-tenant.dto';
import { OnboardingService } from './onboarding.service';
export declare class OnboardingController {
    private readonly onboardingService;
    constructor(onboardingService: OnboardingService);
    onboard(dto: OnboardTenantDto): Promise<{
        token: string;
        tenant: {
            id: string;
            name: string;
            subdomain: string;
            settings: import("@prisma/client/runtime/client").JsonValue;
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
