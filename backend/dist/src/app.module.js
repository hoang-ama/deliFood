"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const auth_module_1 = require("./modules/auth/auth.module");
const restaurant_module_1 = require("./modules/restaurant/restaurant.module");
const menu_module_1 = require("./modules/menu/menu.module");
const admin_module_1 = require("./modules/admin/admin.module");
const order_module_1 = require("./modules/order/order.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const onboarding_module_1 = require("./modules/onboarding/onboarding.module");
const prisma_module_1 = require("./prisma/prisma.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_middleware_1.TenantMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            tenant_module_1.TenantModule,
            onboarding_module_1.OnboardingModule,
            auth_module_1.AuthModule,
            restaurant_module_1.RestaurantModule,
            menu_module_1.MenuModule,
            order_module_1.OrderModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map