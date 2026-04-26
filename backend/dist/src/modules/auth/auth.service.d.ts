import type { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    hashPassword(password: string): string;
    issueAccessToken(user: {
        id: string;
        tenantId: string;
        role: Role;
    }): Promise<string>;
    private passwordsMatch;
    register(dto: RegisterDto, tenantId: string): Promise<{
        token: string;
    }>;
    login(dto: LoginDto, tenantId: string): Promise<{
        token: string;
    }>;
}
