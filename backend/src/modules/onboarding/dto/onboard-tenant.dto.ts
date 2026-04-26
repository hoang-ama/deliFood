import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class TenantBootstrapDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(63)
  @Matches(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
    message:
      'subdomain must be lowercase letters, digits, or hyphens (RFC-style label)',
  })
  subdomain: string;
}

export class OwnerBootstrapDto {
  @Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password: string;
}

export class RestaurantBootstrapDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;
}

export class OnboardTenantDto {
  @ValidateNested()
  @Type(() => TenantBootstrapDto)
  tenant: TenantBootstrapDto;

  @ValidateNested()
  @Type(() => OwnerBootstrapDto)
  owner: OwnerBootstrapDto;

  @ValidateNested()
  @Type(() => RestaurantBootstrapDto)
  restaurant: RestaurantBootstrapDto;

  /** Stored on `Tenant.settings` as JSON (currency, locale, feature flags, etc.). */
  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}
