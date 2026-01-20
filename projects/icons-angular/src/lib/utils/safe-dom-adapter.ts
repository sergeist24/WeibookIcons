import { DOCUMENT } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Safe DOM adapter that provides SSR-safe access to browser APIs.
 * Returns safe fallbacks when running in SSR or when APIs are unavailable.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeDomAdapter {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject<Document | null>(DOCUMENT, { optional: true });

  /**
   * Gets computed styles for an element in a SSR-safe way.
   * Returns null in SSR or when window is unavailable.
   */
  getComputedStyle(element: HTMLElement): CSSStyleDeclaration | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      if (typeof window !== 'undefined' && window.getComputedStyle) {
        return window.getComputedStyle(element);
      }
    } catch (error) {
      // Silently fail in case of any error
      return null;
    }

    return null;
  }

  /**
   * Schedules a callback to run before the next repaint in a SSR-safe way.
   * Returns 0 in SSR (no-op handle).
   */
  requestAnimationFrame(callback: FrameRequestCallback): number {
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR, execute callback immediately in next tick
      if (typeof setImmediate !== 'undefined') {
        setImmediate(() => callback(0));
      } else {
        setTimeout(() => callback(0), 0);
      }
      return 0;
    }

    try {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
      }
    } catch (error) {
      // Fallback to setTimeout if requestAnimationFrame fails
      return setTimeout(callback, 16) as unknown as number;
    }

    // Fallback to setTimeout
    return setTimeout(callback, 16) as unknown as number;
  }

  /**
   * Cancels a previously scheduled animation frame in a SSR-safe way.
   * No-op in SSR.
   */
  cancelAnimationFrame(handle: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(handle);
      } else if (typeof clearTimeout !== 'undefined') {
        clearTimeout(handle);
      }
    } catch (error) {
      // Silently fail
    }
  }
}

