import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuQueryDto } from './dto/menu-query.dto';
import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(dto: CreateMenuDto, tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        restaurantId: string;
        price: number;
    }>;
    findAll(tenantId: string, query: MenuQueryDto): Promise<{
        id: string;
        name: string;
        tenantId: string;
        restaurantId: string;
        price: number;
    }[]>;
}
