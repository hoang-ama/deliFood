import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OnboardTenantDto } from './dto/onboard-tenant.dto';
import { OnboardingSecretGuard } from './guards/onboarding-secret.guard';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * Single entrypoint: creates Tenant (with settings), Owner user, first Restaurant,
   * returns JWT for immediate API use. Does not require tenant middleware / existing tenant.
   */
  @Post()
  @UseGuards(OnboardingSecretGuard)
  onboard(@Body() dto: OnboardTenantDto) {
    return this.onboardingService.onboard(dto);
  }
}
