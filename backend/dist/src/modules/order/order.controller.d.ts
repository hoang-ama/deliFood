import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tenantId: string;
        restaurantId: string;
        status: string;
        total: number;
    }>;
    findAll(req: any, query: OrderQueryDto): Promise<{
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
    updateStatus(id: string, dto: UpdateOrderStatusDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tenantId: string;
        restaurantId: string;
        status: string;
        total: number;
    }>;
}
