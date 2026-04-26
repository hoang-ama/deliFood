import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardSummary(tenantId: string): Promise<{
        users: number;
        restaurants: number;
        menus: number;
        orders: number;
        paidOrders: number;
        pendingOrders: number;
        totalRevenue: number;
    }>;
    getRecentOrders(tenantId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tenantId: string;
        restaurantId: string;
        status: string;
        total: number;
    }[]>;
    getOrderStatusBreakdown(tenantId: string): Promise<{
        status: string;
        count: number;
    }[]>;
}
