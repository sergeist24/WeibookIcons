import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class IconThemeDetectorService implements OnDestroy {
  private readonly themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  private mediaQuery?: MediaQueryList;
  private mediaQueryListener?: (e: MediaQueryListEvent) => void;

  readonly theme$: Observable<'light' | 'dark'> = this.themeSubject.asObservable();

  get currentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.updateTheme(this.mediaQuery.matches);

    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      this.updateTheme(e.matches);
    };

    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', this.mediaQueryListener);
    } else {
      // Fallback para navegadores antiguos
      this.mediaQuery.addListener(this.mediaQueryListener);
    }
  }

  private updateTheme(isDark: boolean): void {
    this.themeSubject.next(isDark ? 'dark' : 'light');
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
      } else {
        // Fallback para navegadores antiguos
        this.mediaQuery.removeListener(this.mediaQueryListener);
      }
    }
  }
}


