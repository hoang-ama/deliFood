import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    create(dto: CreateRestaurantDto, tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }[]>;
    getRestaurantInfo(tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }>;
}
