"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const common_1 = require("@nestjs/common");
const tenant_id_decorator_1 = require("../../common/decorators/tenant-id.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const auth_guard_1 = require("../../common/guards/auth.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_restaurant_dto_1 = require("./dto/create-restaurant.dto");
const restaurant_service_1 = require("./restaurant.service");
let RestaurantController = class RestaurantController {
    restaurantService;
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    create(dto, tenantId) {
        return this.restaurantService.create(dto, tenantId);
    }
    findAll(tenantId) {
        return this.restaurantService.findAll(tenantId);
    }
    async getRestaurantInfo(tenantId) {
        const restaurant = await this.restaurantService.findByTenant(tenantId);
        if (!restaurant) {
            throw new common_1.NotFoundException(`Restaurant not found for tenant: ${tenantId}`);
        }
        return restaurant;
    }
};
exports.RestaurantController = RestaurantController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_dto_1.CreateRestaurantDto, String]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RestaurantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('info'),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "getRestaurantInfo", null);
exports.RestaurantController = RestaurantController = __decorate([
    (0, common_1.Controller)('restaurants'),
    __metadata("design:paramtypes", [restaurant_service_1.RestaurantService])
], RestaurantController);
//# sourceMappingURL=restaurant.controller.js.map