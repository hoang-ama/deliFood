import { AdminService } from './admin.service';
import { RecentOrdersQueryDto } from './dto/recent-orders-query.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getSummary(req: any): Promise<{
        users: number;
        restaurants: number;
        menus: number;
        orders: number;
        paidOrders: number;
        pendingOrders: number;
        totalRevenue: number;
    }>;
    getRecentOrders(req: any, query: RecentOrdersQueryDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tenantId: string;
        restaurantId: string;
        status: string;
        total: number;
    }[]>;
    getOrderStatusBreakdown(req: any): Promise<{
        status: string;
        count: number;
    }[]>;
}
