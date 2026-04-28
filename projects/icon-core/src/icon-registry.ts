import { IconAnimationDefinition, IconRegistration, IconThemeDefinition, IconVariant, WeibookIconsConfig } from './types';

const INTERNAL_VARIANT_SEPARATOR = '::';

export class IconRegistry {
  private readonly icons = new Map<string, IconRegistration>();
  private readonly themes = new Map<string, IconThemeDefinition>();
  private readonly animations = new Map<string, IconAnimationDefinition>();
  private defaultVariant?: IconVariant;

  constructor(config?: WeibookIconsConfig) {
    this.applyConfig(config);
  }

  applyConfig(config?: WeibookIconsConfig): void {
    if (!config) return;
    if (config.defaultVariant) this.defaultVariant = config.defaultVariant.trim();
    config.icons?.forEach((icon) => this.icons.set(this.getKey(icon.name, icon.variant), icon));
    Object.entries(config.themes ?? {}).forEach(([key, value]) => this.themes.set(key, value));
    Object.entries(config.animations ?? {}).forEach(([key, value]) => this.animations.set(key, value));
  }

  getIcon(name: string, variant?: IconVariant): IconRegistration | undefined {
    const explicit = this.icons.get(this.getKey(name, variant));
    if (explicit) return explicit;
    if (!variant && this.defaultVariant) return this.icons.get(this.getKey(name, this.defaultVariant));
    return this.icons.get(this.getKey(name));
  }

  getTheme(name: string): IconThemeDefinition | undefined {
    return this.themes.get(name);
  }

  getAnimation(name: string): IconAnimationDefinition | undefined {
    return this.animations.get(name);
  }

  private getKey(name: string, variant?: IconVariant): string {
    const normalized = name.trim();
    if (!normalized) throw new Error('Icon name cannot be empty.');
    return variant?.trim() ? `${normalized}${INTERNAL_VARIANT_SEPARATOR}${variant.trim()}` : normalized;
  }
}
