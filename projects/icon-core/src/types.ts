export type IconVariant = string;

export interface IconSvgSource {
  svgText: string;
}

export interface IconUrlSource {
  url: string;
}

export type IconSource = IconSvgSource | IconUrlSource;

export interface IconRegistration {
  name: string;
  variant?: IconVariant;
  source: IconSource;
}

export interface IconThemeDefinition {
  cssVariable?: string;
  color?: string;
  inlineStyles?: Record<string, string>;
}

export interface IconAnimationDefinition {
  className: string;
  inlineStyles?: Record<string, string>;
  keyframes?: string;
}

export type IconThemeConfig = Record<string, IconThemeDefinition>;
export type IconAnimationConfig = Record<string, IconAnimationDefinition>;

export interface WeibookIconsConfig {
  defaultVariant?: IconVariant;
  icons?: IconRegistration[];
  themes?: IconThemeConfig;
  animations?: IconAnimationConfig;
}
