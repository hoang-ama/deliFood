import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary(tenantId: string) {
    const [
      users,
      restaurants,
      menus,
      orders,
      paidOrders,
      pendingOrders,
      revenue,
    ] = await Promise.all([
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

  async getRecentOrders(tenantId: string, limit = 10) {
    return this.prisma.order.findMany({
      where: { tenantId },
      orderBy: { id: 'desc' },
      take: limit,
    });
  }

  async getOrderStatusBreakdown(tenantId: string) {
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
}
