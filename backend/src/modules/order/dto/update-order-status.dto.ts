import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'preparing', 'ready', 'delivered', 'cancelled'])
  status: string;
}
