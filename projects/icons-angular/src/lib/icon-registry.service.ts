import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, Inject, Injectable, Optional, SecurityContext, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, defer, of, throwError } from 'rxjs';
import { finalize, map, shareReplay, take } from 'rxjs/operators';
import { IconAlias, IconAnimationDefinition, IconSetRegistration, IconSource, IconThemeDefinition, IconVariant, ProvideWeibookIconsOptions, ProvideWeibookProviders } from './icon.types';
import { ICON_REGISTRY_CONFIG } from './icon-registry.tokens';

const VARIANT_SEPARATOR = ':';
const INTERNAL_VARIANT_SEPARATOR = '::';

interface SvgIconConfig {
  key: string;
  safeUrl?: SafeResourceUrl;
  svgText?: string;
}

interface SvgIconSetConfig {
  namespace: string;
  key: string;
  variant?: IconVariant;
  safeUrl?: SafeResourceUrl;
  svgText?: string;
  parsedSvg?: SVGElement;
}

interface IconRequest {
  kind: 'icon' | 'icon-set';
  name: string;
  variant?: IconVariant;
  namespace?: string;
  iconName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  private readonly iconConfigs = new Map<string, SvgIconConfig>();
  private readonly iconSetConfigs = new Map<string, SvgIconSetConfig[]>();
  private readonly aliasMap = new Map<string, string>();
  private readonly urlFetchCache = new Map<string, Observable<SVGElement>>();
  private readonly svgElementCache = new Map<string, SVGElement>();
  private readonly themes = new Map<string, IconThemeDefinition>();
  private readonly animations = new Map<string, IconAnimationDefinition>();
  private readonly namespaces = new Set<string>();

  private defaultVariant?: IconVariant;

  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(ICON_REGISTRY_CONFIG) private readonly initialConfigs: ProvideWeibookIconsOptions[] | null,
  ) {
    this.initialConfigs?.forEach((config) => this.applyConfig(config));
  }

  applyConfig(config?: ProvideWeibookIconsOptions): void {
    if (!config) {
      return;
    }

    if (config.defaultVariant) {
      this.defaultVariant = config.defaultVariant;
    }

    config.icons?.forEach((icon) =>
      this.registerSvgIcon(icon.name, icon.source, {
        variant: icon.variant,
        aliases: icon.aliases,
      }),
    );

    config.iconSets?.forEach((set) => this.registerSvgIconSet(set));
    config.aliases?.forEach((alias) => this.registerAlias(alias));

    if (config.themes) {
      Object.entries(config.themes).forEach(([name, definition]) => this.registerTheme(name, definition));
    }

    if (config.animations) {
      Object.entries(config.animations).forEach(([name, definition]) => this.registerAnimation(name, definition));
    }
  }

  registerSvgIcon(name: string, source: IconSource, options?: { variant?: IconVariant; aliases?: string[] }): void {
    const key = this.serializeIconKey(name, options?.variant);
    const config = this.createIconConfigFromSource(key, source);

    this.iconConfigs.set(key, config);
    this.svgElementCache.delete(key);

    options?.aliases?.forEach((alias) => {
      const aliasKey = this.serializeIconKey(alias, options.variant);
      this.aliasMap.set(aliasKey, key);
    });
  }

  registerSvgIconSet(set: IconSetRegistration): void {
    const namespace = (set.namespace ?? '').trim();

    if (!namespace) {
      throw new Error('Icon set registration requires a non-empty namespace.');
    }

    const key = this.serializeIconSetKey(namespace, set.variant);
    const config = this.createIconSetConfig(namespace, key, set.source, set.variant);
    const configs = this.iconSetConfigs.get(key) ?? [];

    configs.push(config);
    this.iconSetConfigs.set(key, configs);
    this.namespaces.add(namespace);
  }

  registerAlias(alias: IconAlias): void {
    const aliasKey = this.serializeIconKey(alias.alias);
    const targetKey = this.serializeIconKey(alias.target);
    this.aliasMap.set(aliasKey, targetKey);
  }

  registerTheme(name: string, definition: IconThemeDefinition): void {
    this.themes.set(name, definition);
  }

  registerAnimation(name: string, definition: IconAnimationDefinition): void {
    this.animations.set(name, definition);
  }

  setDefaultVariant(variant?: IconVariant): void {
    this.defaultVariant = variant?.trim() || undefined;
  }

  getTheme(name: string): IconThemeDefinition | undefined {
    return this.themes.get(name);
  }

  getAnimation(name: string): IconAnimationDefinition | undefined {
    return this.animations.get(name);
  }

  getNamedSvgIcon(name: string, variant?: IconVariant): Observable<SVGElement> {
    const request = this.resolveIconRequest(name, variant);

    if (request.kind === 'icon') {
      return this.loadIndividualIcon(request.name, request.variant);
    }

    if (!request.namespace || !request.iconName) {
      return throwError(new Error(`Icon "${name}" is not registered.`));
    }

    return this.loadIconFromSet(request.namespace, request.iconName, request.variant);
  }

  private loadIndividualIcon(name: string, variant?: IconVariant): Observable<SVGElement> {
    const key = this.serializeIconKey(name, variant);
    const aliasTarget = this.aliasMap.get(key);
    const resolvedKey = aliasTarget ?? key;

    const cachedSvg = this.svgElementCache.get(resolvedKey);
    if (cachedSvg) {
      return of(this.cloneSvg(cachedSvg));
    }

    const config = this.iconConfigs.get(resolvedKey);
    if (config) {
      return this.createSvgFromConfig(config);
    }

    if (!variant && this.defaultVariant) {
      return this.loadIndividualIcon(name, this.defaultVariant);
    }

    return throwError(new Error(`Icon "${name}"${variant ? ` (variant "${variant}")` : ''} is not registered.`));
  }

  private loadIconFromSet(namespace: string, iconName: string, variant?: IconVariant): Observable<SVGElement> {
    const key = this.serializeIconSetKey(namespace, variant);
    const configs = this.iconSetConfigs.get(key);

    if (!(configs?.length)) {
      if (!variant && this.defaultVariant) {
        return this.loadIconFromSet(namespace, iconName, this.defaultVariant);
      }

      return throwError(new Error(`Icon namespace "${namespace}" is not registered.`));
    }

    return defer(async () => {
      for (const config of configs) {
        const svg = await this.getSvgFromSetConfig(config);
        const found = svg.querySelector(`#${iconName}`);

        if (found) {
          const viewBox = found.getAttribute('viewBox') ?? svg.getAttribute('viewBox') ?? '0 0 24 24';
          const wrapper = this.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          wrapper.setAttribute('viewBox', viewBox);
          wrapper.appendChild(found.cloneNode(true));
          return wrapper;
        }
      }

      throw new Error(`Icon "${iconName}" could not be found in namespace "${namespace}".`);
    });
  }

  private createSvgFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgText) {
      const svg = this.buildSvgElement(config.svgText);
      this.svgElementCache.set(config.key, svg);
      return of(this.cloneSvg(svg));
    }

    if (!config.safeUrl) {
      return throwError(new Error(`Icon "${config.key}" is missing a valid source.`));
    }

    if (this.urlFetchCache.has(config.key)) {
      return this.urlFetchCache.get(config.key)!;
    }

    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, config.safeUrl);
    if (!sanitizedUrl) {
      return throwError(new Error(`Icon "${config.key}" contains an unsafe resource URL.`));
    }

    const request$ = this.http.get(sanitizedUrl, { responseType: 'text' }).pipe(
      map((svgText) => this.buildSvgElement(svgText)),
      map((svg) => {
        this.svgElementCache.set(config.key, svg);
        return this.cloneSvg(svg);
      }),
      finalize(() => this.urlFetchCache.delete(config.key)),
      shareReplay(1),
    );

    this.urlFetchCache.set(config.key, request$);
    return request$;
  }

  private async getSvgFromSetConfig(config: SvgIconSetConfig): Promise<SVGElement> {
    if (config.parsedSvg) {
      return config.parsedSvg;
    }

    if (config.svgText) {
      config.parsedSvg = this.buildSvgElement(config.svgText);
      return config.parsedSvg;
    }

    if (!config.safeUrl) {
      throw new Error(`Icon set "${config.namespace}" is missing a valid source.`);
    }

    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, config.safeUrl);
    if (!sanitizedUrl) {
      throw new Error(`Icon set "${config.namespace}" contains an unsafe resource URL.`);
    }

    const svgText = await this.http.get(sanitizedUrl, { responseType: 'text' }).pipe(take(1)).toPromise();
    if (!svgText) {
      throw new Error(`Failed to fetch icon set "${config.namespace}" from URL.`);
    }
    config.svgText = svgText;
    config.parsedSvg = this.buildSvgElement(svgText);

    return config.parsedSvg;
  }

  private resolveIconRequest(name: string, variant?: IconVariant): IconRequest {
    const trimmedName = name.trim();
    if (!trimmedName.includes(VARIANT_SEPARATOR)) {
      return { kind: 'icon', name: trimmedName, variant };
    }

    const [firstToken, secondToken] = trimmedName.split(VARIANT_SEPARATOR);

    if (this.namespaces.has(firstToken)) {
      return { kind: 'icon-set', name: trimmedName, namespace: firstToken, iconName: secondToken, variant };
    }

    return {
      kind: 'icon',
      name: firstToken,
      variant: variant ?? secondToken,
    };
  }

  private serializeIconKey(name: string, variant?: IconVariant): string {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Icon name cannot be empty.');
    }

    const normalizedVariant = variant?.trim();
    return normalizedVariant ? `${trimmedName}${INTERNAL_VARIANT_SEPARATOR}${normalizedVariant}` : trimmedName;
  }

  private serializeIconSetKey(namespace: string, variant?: IconVariant): string {
    const trimmedNamespace = namespace.trim();
    if (!trimmedNamespace) {
      throw new Error('Icon namespace cannot be empty.');
    }

    const normalizedVariant = variant?.trim();
    return normalizedVariant ? `${trimmedNamespace}${INTERNAL_VARIANT_SEPARATOR}${normalizedVariant}` : trimmedNamespace;
  }

  private createIconConfigFromSource(key: string, source: IconSource): SvgIconConfig {
    if ('svgText' in source) {
      return { key, svgText: source.svgText };
    }

    if ('url' in source) {
      return { key, safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(source.url) };
    }

    throw new Error('Unsupported icon source type. Use `url` or `svgText`.');
  }

  private createIconSetConfig(
    namespace: string,
    key: string,
    source: IconSource,
    variant?: IconVariant,
  ): SvgIconSetConfig {
    if ('svgText' in source) {
      return { namespace, key, variant, svgText: source.svgText };
    }

    if ('url' in source) {
      return { namespace, key, variant, safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(source.url) };
    }

    throw new Error('Unsupported icon set source type.');
  }

  private buildSvgElement(svgContent: string): SVGElement {
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(svgContent));

    if (!sanitized) {
      throw new Error('Unable to sanitize SVG content.');
    }

    const container = this.document.createElement('div');
    container.innerHTML = sanitized;

    const svg = container.querySelector('svg');
    if (!svg) {
      throw new Error('Icon content must contain a single <svg> root element.');
    }

    return svg as SVGElement;
  }

  private cloneSvg(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }
}

export const provideWeibookIcons = (config: ProvideWeibookIconsOptions = {}): ProvideWeibookProviders => [
  {
    provide: ICON_REGISTRY_CONFIG,
    useValue: config,
    multi: true,
  },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory: () => {
      const registry = inject(IconRegistryService);
      return () => registry.applyConfig(config);
    },
  },
];

