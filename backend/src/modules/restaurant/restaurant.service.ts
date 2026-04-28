import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRestaurantDto, tenantId: string) {
    return this.prisma.restaurant.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.restaurant.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.restaurant.findFirst({
      where: { tenantId },
    });
  }
}