import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import type { OnboardTenantDto } from './dto/onboard-tenant.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async onboard(dto: OnboardTenantDto) {
    const subdomain = dto.tenant.subdomain.trim().toLowerCase();
    const email = dto.owner.email.trim().toLowerCase();

    try {
      return await this.prisma.$transaction(async (tx) => {
        const settings: Prisma.InputJsonValue =
          dto.configuration !== undefined && dto.configuration !== null
            ? (dto.configuration as Prisma.InputJsonValue)
            : {};

        const tenant = await tx.tenant.create({
          data: {
            name: dto.tenant.name.trim(),
            subdomain,
            settings,
          },
        });

        const owner = await tx.user.create({
          data: {
            email,
            password: this.authService.hashPassword(dto.owner.password),
            role: 'owner',
            tenantId: tenant.id,
          },
        });

        const restaurant = await tx.restaurant.create({
          data: {
            name: dto.restaurant.name.trim(),
            tenantId: tenant.id,
          },
        });

        const token = await this.authService.issueAccessToken(owner);

        return {
          token,
          tenant: {
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
            settings: tenant.settings,
            createdAt: tenant.createdAt,
          },
          owner: {
            id: owner.id,
            email: owner.email,
            role: owner.role,
          },
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            tenantId: restaurant.tenantId,
          },
        };
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'This subdomain or email is already registered for an existing workspace',
        );
      }
      throw e;
    }
  }
}
