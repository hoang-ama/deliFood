import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { RecentOrdersQueryDto } from './dto/recent-orders-query.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AuthGuard, RolesGuard)
@Roles('owner')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/summary')
  getSummary(@Req() req: any) {
    return this.adminService.getDashboardSummary(req.tenantId);
  }

  @Get('dashboard/orders')
  getRecentOrders(@Req() req: any, @Query() query: RecentOrdersQueryDto) {
    const limit = query.limit ?? 10;
    return this.adminService.getRecentOrders(req.tenantId, limit);
  }

  @Get('dashboard/orders/status')
  getOrderStatusBreakdown(@Req() req: any) {
    return this.adminService.getOrderStatusBreakdown(req.tenantId);
  }
}
