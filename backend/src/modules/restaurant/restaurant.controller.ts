import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AuthGuard, RolesGuard)
  @Roles('owner')
  create(@Body() dto: CreateRestaurantDto, @TenantId() tenantId: string) {
    return this.restaurantService.create(dto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.restaurantService.findAll(tenantId);
  }

  @Get('info')
  async getRestaurantInfo(@TenantId() tenantId: string) {
    const restaurant = await this.restaurantService.findByTenant(tenantId);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found for tenant: ${tenantId}`);
    }
    return restaurant;
  }
}