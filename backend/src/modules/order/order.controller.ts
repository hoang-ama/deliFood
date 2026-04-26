import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, AuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles('customer', 'owner', 'staff')
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(dto, req.tenantId, req.user?.userId);
  }

  @Get()
  @Roles('customer', 'owner', 'staff')
  findAll(@Req() req: any, @Query() query: OrderQueryDto) {
    return this.orderService.findAll(
      req.tenantId,
      query,
      req.user?.role,
      req.user?.userId,
    );
  }

  @Patch(':id/status')
  @Roles('owner', 'staff')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: any,
  ) {
    return this.orderService.updateStatus(id, dto, req.tenantId);
  }
}
