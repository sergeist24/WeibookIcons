import { Injectable } from '@angular/core';
import { IconRegistryService } from './icon-registry.service';
import { IconThemeConfig, IconThemeDefinition } from './icon.types';

@Injectable({
  providedIn: 'root',
})
export class IconThemeService {
  constructor(private readonly registry: IconRegistryService) {}

  registerTheme(name: string, definition: IconThemeDefinition): void {
    this.registry.registerTheme(name, definition);
  }

  registerThemes(themes: IconThemeConfig): void {
    Object.entries(themes).forEach(([name, definition]) => this.registerTheme(name, definition));
  }

  resolve(name: string): IconThemeDefinition | undefined {
    return this.registry.getTheme(name);
  }
}

