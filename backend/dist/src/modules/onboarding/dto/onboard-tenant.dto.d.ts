export declare class TenantBootstrapDto {
    name: string;
    subdomain: string;
}
export declare class OwnerBootstrapDto {
    email: string;
    password: string;
}
export declare class RestaurantBootstrapDto {
    name: string;
}
export declare class OnboardTenantDto {
    tenant: TenantBootstrapDto;
    owner: OwnerBootstrapDto;
    restaurant: RestaurantBootstrapDto;
    configuration?: Record<string, unknown>;
}
