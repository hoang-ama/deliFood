import { IsOptional, IsUUID } from 'class-validator';

export class MenuQueryDto {
  @IsOptional()
  @IsUUID('4')
  restaurantId?: string;
}
