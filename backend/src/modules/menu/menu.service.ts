import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMenuDto, tenantId: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id: dto.restaurantId,
        tenantId,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found for tenant');
    }

    return this.prisma.menu.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string, restaurantId?: string) {
    return this.prisma.menu.findMany({
      where: {
        tenantId,
        ...(restaurantId ? { restaurantId } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }
}
