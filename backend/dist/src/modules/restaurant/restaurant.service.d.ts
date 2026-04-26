import { PrismaService } from '../../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
export declare class RestaurantService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRestaurantDto, tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }[]>;
}
