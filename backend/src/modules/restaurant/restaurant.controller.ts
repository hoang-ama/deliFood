import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  create(@Body() dto: CreateRestaurantDto, @Req() req: any) {
    return this.restaurantService.create(dto, req.tenantId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.restaurantService.findAll(req.tenantId);
  }
}
