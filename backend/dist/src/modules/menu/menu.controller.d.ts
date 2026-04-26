import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuQueryDto } from './dto/menu-query.dto';
import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(dto: CreateMenuDto, req: any): Promise<{
        id: string;
        name: string;
        tenantId: string;
        price: number;
        restaurantId: string;
    }>;
    findAll(req: any, query: MenuQueryDto): Promise<{
        id: string;
        name: string;
        tenantId: string;
        price: number;
        restaurantId: string;
    }[]>;
}
