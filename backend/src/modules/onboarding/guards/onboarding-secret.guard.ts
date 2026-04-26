import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import type { Request } from 'express';

/**
 * When `ONBOARDING_SECRET` is set in the environment, POST /api/onboarding must
 * send matching `x-onboarding-secret`. If unset, onboarding is open (development only).
 */
@Injectable()
export class OnboardingSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ONBOARDING_SECRET?.trim();
    if (!expected) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers['x-onboarding-secret'];
    const provided =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? (raw[0] ?? '') : '';

    const a = Buffer.from(provided, 'utf8');
    const b = Buffer.from(expected, 'utf8');

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new ForbiddenException('Invalid onboarding credentials');
    }

    return true;
  }
}
