import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, tenantId: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id: dto.restaurantId,
        tenantId,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found for tenant');
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

  async findAll(
    tenantId: string,
    query: OrderQueryDto,
    requesterRole?: string,
    requesterUserId?: string,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      tenantId,
      ...(query.status !== undefined && query.status !== ''
        ? { status: query.status.trim() }
        : {}),
      ...(query.restaurantId ? { restaurantId: query.restaurantId } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
    };

    if (requesterRole === 'customer') {
      if (!requesterUserId) {
        throw new UnauthorizedException('Invalid authenticated user');
      }
      where.userId = requesterUserId;
    }

    const totalBounds =
      query.minTotal !== undefined || query.maxTotal !== undefined
        ? {
            total: {
              ...(query.minTotal !== undefined ? { gte: query.minTotal } : {}),
              ...(query.maxTotal !== undefined ? { lte: query.maxTotal } : {}),
            },
          }
        : {};

    if (
      query.minTotal !== undefined &&
      query.maxTotal !== undefined &&
      query.minTotal > query.maxTotal
    ) {
      throw new BadRequestException('minTotal cannot be greater than maxTotal');
    }

    const whereClause: Prisma.OrderWhereInput = { ...where, ...totalBounds };

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

  async updateStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
    tenantId: string,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found for tenant');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });
  }
}
