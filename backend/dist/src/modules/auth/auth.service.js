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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    hashPassword(password) {
        return (0, crypto_1.createHash)('sha256').update(password).digest('hex');
    }
    issueAccessToken(user) {
        return this.jwtService.signAsync({
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
        });
    }
    passwordsMatch(rawPassword, hashedPassword) {
        const candidate = this.hashPassword(rawPassword);
        const left = Buffer.from(candidate, 'utf8');
        const right = Buffer.from(hashedPassword, 'utf8');
        if (left.length !== right.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(left, right);
    }
    async register(dto, tenantId) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email: dto.email,
                },
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists for this tenant');
        }
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: this.hashPassword(dto.password),
                role: dto.role ?? 'customer',
                tenantId,
            },
        });
        const token = await this.issueAccessToken(user);
        return { token };
    }
    async login(dto, tenantId) {
        const user = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId,
                    email: dto.email,
                },
            },
        });
        if (!user || !this.passwordsMatch(dto.password, user.password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = await this.issueAccessToken(user);
        return { token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map