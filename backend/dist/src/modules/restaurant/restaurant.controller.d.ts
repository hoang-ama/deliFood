import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    create(dto: CreateRestaurantDto, req: any): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }[]>;
}
