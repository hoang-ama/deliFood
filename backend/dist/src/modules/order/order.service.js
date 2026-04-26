"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrderService = class OrderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId, userId) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id: dto.restaurantId,
                tenantId,
            },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restaurant not found for tenant');
        }
        return this.prisma.order.create({
            data: {
                restaurantId: dto.restaurantId,
                total: dto.total,
                tenantId,
                userId,
                status: 'pending',
            },
        });
    }
    async findAll(tenantId, query, requesterRole, requesterUserId) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
            ...(query.status !== undefined && query.status !== ''
                ? { status: query.status.trim() }
                : {}),
            ...(query.restaurantId ? { restaurantId: query.restaurantId } : {}),
            ...(query.userId ? { userId: query.userId } : {}),
        };
        if (requesterRole === 'customer') {
            if (!requesterUserId) {
                throw new common_1.UnauthorizedException('Invalid authenticated user');
            }
            where.userId = requesterUserId;
        }
        const totalBounds = query.minTotal !== undefined || query.maxTotal !== undefined
            ? {
                total: {
                    ...(query.minTotal !== undefined ? { gte: query.minTotal } : {}),
                    ...(query.maxTotal !== undefined ? { lte: query.maxTotal } : {}),
                },
            }
            : {};
        if (query.minTotal !== undefined &&
            query.maxTotal !== undefined &&
            query.minTotal > query.maxTotal) {
            throw new common_1.BadRequestException('minTotal cannot be greater than maxTotal');
        }
        const whereClause = { ...where, ...totalBounds };
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where: whereClause,
                orderBy: { id: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where: whereClause }),
        ]);
        const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
    async updateStatus(orderId, dto, tenantId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                tenantId,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found for tenant');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: dto.status },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map