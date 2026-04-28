import { Provider } from '@angular/core';
import {
  IconAnimationConfig as CoreIconAnimationConfig,
  IconAnimationDefinition as CoreIconAnimationDefinition,
  IconRegistration as CoreIconRegistration,
  IconSource as CoreIconSource,
  IconThemeConfig as CoreIconThemeConfig,
  IconThemeDefinition as CoreIconThemeDefinition,
  IconVariant as CoreIconVariant,
} from '@weibook/icon-core';

export type IconVariant = CoreIconVariant;

export interface IconRegistration extends CoreIconRegistration {
  aliases?: string[];
}

export interface IconAlias {
  alias: string;
  target: string;
}

export interface IconSetRegistration {
  namespace?: string;
  variant?: IconVariant;
  source: IconSource;
}

export type IconSource = CoreIconSource;

export interface IconThemeDefinition extends CoreIconThemeDefinition {
  className?: string;
}

export type IconThemeConfig = CoreIconThemeConfig & Record<string, IconThemeDefinition>;

export type IconAnimationDefinition = CoreIconAnimationDefinition;

export type IconAnimationConfig = CoreIconAnimationConfig;

export interface ProvideWeibookIconsOptions {
  defaultVariant?: IconVariant;
  icons?: IconRegistration[];
  iconSets?: IconSetRegistration[];
  aliases?: IconAlias[];
  themes?: IconThemeConfig;
  animations?: IconAnimationConfig;
}

export type ProvideWeibookProviders = Provider[];

/**
 * Predefined animation names available in the library.
 * These animations are registered by default via `provideWeibookIconDefaults()`.
 */
export type IconAnimationName = 
  | 'spin'
  | 'rotate'
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'fade'
  | 'zoom'
  | 'tada'
  | 'float'
  | 'glow'
  | 'tilt'
  | 'flip'
  | 'rubber'
  | string; // Allow custom animations

/**
 * Predefined theme names available in the library.
 * These themes are registered by default via `provideWeibookIconDefaults()`.
 */
export type IconThemeName =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'green'
  | 'warning'
  | 'danger'
  | 'orange'
  | 'gray'
  | 'gray2'
  | 'gray3'
  | 'blue'
  | 'blue2'
  | 'purple'
  | 'muted'
  | string; // Allow custom themes and direct color values

