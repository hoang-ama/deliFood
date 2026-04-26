import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingSecretGuard } from './guards/onboarding-secret.guard';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, OnboardingSecretGuard],
})
export class OnboardingModule {}
