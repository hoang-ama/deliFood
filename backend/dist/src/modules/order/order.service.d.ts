import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOrderDto, tenantId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tenantId: string;
        restaurantId: string;
        status: string;
        total: number;
    }>;
    findAll(tenantId: string, query: OrderQueryDto, requesterRole?: string, requesterUserId?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            tenantId: string;
            restaurantId: string;
            status: string;
            total: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(orderId: string, dto: UpdateOrderStatusDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tenantId: string;
        restaurantId: string;
        status: string;
        total: number;
    }>;
}
