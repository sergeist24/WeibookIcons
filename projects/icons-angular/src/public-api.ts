/*
 * Public API Surface of icons-angular
 */

export * from './lib/icon-registry.service';
export * from './lib/icon-registry.tokens';
export * from './lib/icon.types';
export * from './lib/icon-theme.service';
export * from './lib/icon-theme-detector.service';
export * from './lib/weibook-icon.component';
export * from './lib/weibook-icon.module';
export * from './lib/icon-presets';
export * from './lib/icon-manifest.providers';
// Note: WB_ICON_MANIFEST is exported for backward compatibility but importing it directly
// prevents tree shaking. Use provideWeibookIconManifestLazy() instead for better bundle size.
export * from './lib/generated/icon-manifest';
export * from './lib/icon-gallery/icon-gallery.component';
export * from './lib/icon-gallery/icon-gallery.module';
