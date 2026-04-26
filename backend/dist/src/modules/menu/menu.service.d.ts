import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
export declare class MenuService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMenuDto, tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        price: number;
        restaurantId: string;
    }>;
    findAll(tenantId: string, restaurantId?: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        price: number;
        restaurantId: string;
    }[]>;
}
