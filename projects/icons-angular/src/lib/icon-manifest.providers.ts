import { provideWeibookIcons } from './icon-registry.service';
import { WB_ICON_MANIFEST } from './generated/icon-manifest';
import { ProvideWeibookProviders } from './icon.types';

/**
 * Provides all icons from the manifest.
 * This imports the full manifest, which prevents tree shaking.
 * For better bundle size, use provideWeibookIconManifestLazy() instead.
 * 
 * @deprecated Use provideWeibookIconManifestLazy() for better tree shaking support.
 */
export const provideWeibookIconManifest = (): ProvideWeibookProviders =>
  provideWeibookIcons({
    defaultVariant: 'outlined',
    icons: WB_ICON_MANIFEST,
  });

/**
 * Provides icons from the manifest using lazy loading for better tree shaking.
 * Only loads the variant icons that are actually used in your application.
 * 
 * Note: Currently, this function filters the full manifest at runtime.
 * For true tree shaking, the manifest generator should be updated to create
 * separate manifest files per variant that can be imported statically.
 * 
 * @param variants - Array of variants to load ('filled', 'outlined', or both).
 *                   If not provided, loads all variants (same as provideWeibookIconManifest).
 * @returns Provider configuration for Weibook icons
 * 
 * @example
 * // Load only outlined icons
 * provideWeibookIconManifestLazy(['outlined'])
 * 
 * @example
 * // Load both variants
 * provideWeibookIconManifestLazy(['filled', 'outlined'])
 */
export const provideWeibookIconManifestLazy = (variants: ('filled' | 'outlined')[] = ['filled', 'outlined']): ProvideWeibookProviders => {
  // Filter manifest by requested variants
  // TODO: Update manifest generator to create separate files for true tree shaking
  const filteredIcons = WB_ICON_MANIFEST.filter(icon => {
    if (!icon.variant) {
      return variants.length > 0; // Include icons without variant if any variant is requested
    }
    return variants.includes(icon.variant as 'filled' | 'outlined');
  });

  return provideWeibookIcons({
    defaultVariant: 'outlined',
    icons: filteredIcons,
  });
};

