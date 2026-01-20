import { InjectionToken } from '@angular/core';
import { ProvideWeibookIconsOptions } from './icon.types';

export const ICON_REGISTRY_CONFIG = new InjectionToken<ProvideWeibookIconsOptions>('ICON_REGISTRY_CONFIG');

/**
 * Injection token for enabling debug mode in Weibook Icons.
 * When enabled, the library will log detailed information about icon loading,
 * rendering, and errors to the console.
 * 
 * @example
 * // Enable debug mode in your app
 * providers: [
 *   { provide: WB_ICON_DEBUG, useValue: true }
 * ]
 */
export const WB_ICON_DEBUG = new InjectionToken<boolean>('WB_ICON_DEBUG', {
  providedIn: 'root',
  factory: () => false,
});

