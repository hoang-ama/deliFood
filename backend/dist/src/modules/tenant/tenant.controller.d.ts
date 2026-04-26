import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    create(dto: CreateTenantDto): Promise<{
        id: string;
        subdomain: string;
        name: string;
        settings: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
    }>;
}
