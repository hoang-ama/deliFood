"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingSecretGuard = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let OnboardingSecretGuard = class OnboardingSecretGuard {
    canActivate(context) {
        const expected = process.env.ONBOARDING_SECRET?.trim();
        if (!expected) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const raw = req.headers['x-onboarding-secret'];
        const provided = typeof raw === 'string' ? raw : Array.isArray(raw) ? (raw[0] ?? '') : '';
        const a = Buffer.from(provided, 'utf8');
        const b = Buffer.from(expected, 'utf8');
        if (a.length !== b.length || !(0, crypto_1.timingSafeEqual)(a, b)) {
            throw new common_1.ForbiddenException('Invalid onboarding credentials');
        }
        return true;
    }
};
exports.OnboardingSecretGuard = OnboardingSecretGuard;
exports.OnboardingSecretGuard = OnboardingSecretGuard = __decorate([
    (0, common_1.Injectable)()
], OnboardingSecretGuard);
//# sourceMappingURL=onboarding-secret.guard.js.map