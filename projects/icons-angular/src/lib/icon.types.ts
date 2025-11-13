import { Provider } from '@angular/core';

export type IconVariant = string;

export interface IconRegistration {
  name: string;
  source: IconSource;
  variant?: IconVariant;
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

export type IconSource = IconUrlSource | IconSvgSource;

export interface IconUrlSource {
  url: string;
}

export interface IconSvgSource {
  svgText: string;
}

export interface IconThemeDefinition {
  className?: string;
  cssVariable?: string;
  color?: string;
  inlineStyles?: Record<string, string>;
}

export type IconThemeConfig = Record<string, IconThemeDefinition>;

export interface IconAnimationDefinition {
  className: string;
  inlineStyles?: Record<string, string>;
  keyframes?: string;
}

export type IconAnimationConfig = Record<string, IconAnimationDefinition>;

export interface ProvideWeibookIconsOptions {
  defaultVariant?: IconVariant;
  icons?: IconRegistration[];
  iconSets?: IconSetRegistration[];
  aliases?: IconAlias[];
  themes?: IconThemeConfig;
  animations?: IconAnimationConfig;
}

export type ProvideWeibookProviders = Provider[];

