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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardTenantDto = exports.RestaurantBootstrapDto = exports.OwnerBootstrapDto = exports.TenantBootstrapDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TenantBootstrapDto {
    name;
    subdomain;
}
exports.TenantBootstrapDto = TenantBootstrapDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], TenantBootstrapDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(63),
    (0, class_validator_1.Matches)(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
        message: 'subdomain must be lowercase letters, digits, or hyphens (RFC-style label)',
    }),
    __metadata("design:type", String)
], TenantBootstrapDto.prototype, "subdomain", void 0);
class OwnerBootstrapDto {
    email;
    password;
}
exports.OwnerBootstrapDto = OwnerBootstrapDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(320),
    __metadata("design:type", String)
], OwnerBootstrapDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(12),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], OwnerBootstrapDto.prototype, "password", void 0);
class RestaurantBootstrapDto {
    name;
}
exports.RestaurantBootstrapDto = RestaurantBootstrapDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], RestaurantBootstrapDto.prototype, "name", void 0);
class OnboardTenantDto {
    tenant;
    owner;
    restaurant;
    configuration;
}
exports.OnboardTenantDto = OnboardTenantDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenantBootstrapDto),
    __metadata("design:type", TenantBootstrapDto)
], OnboardTenantDto.prototype, "tenant", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OwnerBootstrapDto),
    __metadata("design:type", OwnerBootstrapDto)
], OnboardTenantDto.prototype, "owner", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RestaurantBootstrapDto),
    __metadata("design:type", RestaurantBootstrapDto)
], OnboardTenantDto.prototype, "restaurant", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], OnboardTenantDto.prototype, "configuration", void 0);
//# sourceMappingURL=onboard-tenant.dto.js.map