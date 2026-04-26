import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTenantDto): Promise<{
        id: string;
        subdomain: string;
        name: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
    }>;
}
