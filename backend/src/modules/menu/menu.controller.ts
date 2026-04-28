import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuQueryDto } from './dto/menu-query.dto';
import { MenuService } from './menu.service';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AuthGuard, RolesGuard)
  @Roles('owner', 'staff')
  create(@Body() dto: CreateMenuDto, @TenantId() tenantId: string) {
    return this.menuService.create(dto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string, @Query() query: MenuQueryDto) {
    return this.menuService.findAll(tenantId, query.restaurantId);
  }
}