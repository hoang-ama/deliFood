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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardSummary(tenantId) {
        const [users, restaurants, menus, orders, paidOrders, pendingOrders, revenue,] = await Promise.all([
            this.prisma.user.count({ where: { tenantId } }),
            this.prisma.restaurant.count({ where: { tenantId } }),
            this.prisma.menu.count({ where: { tenantId } }),
            this.prisma.order.count({ where: { tenantId } }),
            this.prisma.order.count({ where: { tenantId, status: 'paid' } }),
            this.prisma.order.count({ where: { tenantId, status: 'pending' } }),
            this.prisma.order.aggregate({
                where: { tenantId },
                _sum: { total: true },
            }),
        ]);
        return {
            users,
            restaurants,
            menus,
            orders,
            paidOrders,
            pendingOrders,
            totalRevenue: revenue._sum.total ?? 0,
        };
    }
    async getRecentOrders(tenantId, limit = 10) {
        return this.prisma.order.findMany({
            where: { tenantId },
            orderBy: { id: 'desc' },
            take: limit,
        });
    }
    async getOrderStatusBreakdown(tenantId) {
        const grouped = await this.prisma.order.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { _all: true },
        });
        return grouped.map((item) => ({
            status: item.status,
            count: item._count._all,
        }));
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map