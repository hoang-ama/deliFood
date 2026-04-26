export declare enum UserRole {
    customer = "customer",
    owner = "owner",
    staff = "staff"
}
export declare class RegisterDto {
    email: string;
    password: string;
    role?: UserRole;
}
