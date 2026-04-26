import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { createHash, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** SHA-256 hash used for persisted passwords (register, onboarding). */
  hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  issueAccessToken(user: {
    id: string;
    tenantId: string;
    role: Role;
  }): Promise<string> {
    return this.jwtService.signAsync({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    });
  }

  private passwordsMatch(rawPassword: string, hashedPassword: string): boolean {
    const candidate = this.hashPassword(rawPassword);
    const left = Buffer.from(candidate, 'utf8');
    const right = Buffer.from(hashedPassword, 'utf8');

    if (left.length !== right.length) {
      return false;
    }

    return timingSafeEqual(left, right);
  }

  async register(dto: RegisterDto, tenantId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email: dto.email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists for this tenant');
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

  async login(dto: LoginDto, tenantId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email: dto.email,
        },
      },
    });

    if (!user || !this.passwordsMatch(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.issueAccessToken(user);

    return { token };
  }
}
