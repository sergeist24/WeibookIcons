import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  AfterContentInit,
  AfterContentChecked,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { IconRegistryService } from './icon-registry.service';
import { IconThemeDefinition } from './icon.types';

type IconKey = {
  name: string;
  variant?: string;
};

const INSERTED_KEYFRAMES = new Set<string>();

@Component({
  selector: 'wb-icon',
  template: '<ng-content></ng-content>',
  styleUrls: ['./weibook-icon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeibookIconComponent
  implements OnChanges, OnDestroy, AfterContentInit, AfterContentChecked
{
  @HostBinding('class.wb-icon_host') readonly hostClass = true;

  @Input() name?: string;
  @Input() svgIcon?: string;
  @Input() variant?: string;
  /** 
   * Animation name. Use predefined animations ('spin', 'pulse', 'bounce', etc.) or custom animation class names.
   * @see IconAnimationName for predefined animations
   */
  @Input() animation?: string;
  /** 
   * Color theme name or direct color value (hex, rgb, CSS variable, etc.).
   * @see IconThemeName for predefined theme names
   */
  @Input() color?: string;
  @Input() fontSet?: string;
  @Input() ariaLabel?: string;
  @Input() tabIndex: number | null = null;
  /**
   * Optional explicit size. When provided, overrides the computed font-size (e.g. "24px", "1.5em").
   */
  @Input() size?: string;
  /**
   * Stroke width for SVG elements. When provided, applies stroke-width to all SVG paths and shapes.
   * Can be a number (e.g., "2") or a string with units (e.g., "2px", "0.1em").
   */
  @Input() strokeWidth?: string | number;
  /**
   * Stroke color for SVG elements. When provided, applies stroke color to all SVG paths and shapes.
   * If not provided, uses the icon's color. Can be a color value or theme name.
   */
  @Input() stroke?: string;
  /**
   * Enable smooth transitions for dynamic changes (color, size, icon).
   * When present (even without value), adds CSS transitions to all dynamic properties.
   * Use transition="false" to explicitly disable transitions.
   */
  @Input() transition?: boolean | string;
  /**
   * Source icon name for morphing. When used with `to`, enables smooth morphing between two icons.
   */
  @Input() from?: string;
  /**
   * Target icon name for morphing. When used with `from`, enables smooth morphing between two icons.
   */
  @Input() to?: string;
  /**
   * Controls which icon is shown when using morphing (from/to).
   * When true, shows `to` icon. When false, shows `from` icon.
   */
  @Input() active?: boolean;

  @Output() iconError = new EventEmitter<unknown>();
  @Output() iconClick = new EventEmitter<MouseEvent>();

  @HostBinding('attr.role') readonly hostRole = 'img';

  @HostBinding('attr.aria-hidden')
  get ariaHidden(): 'true' | null {
    return this.ariaLabel ? null : 'true';
  }

  @HostBinding('attr.aria-label')
  get ariaLabelValue(): string | null {
    return this.ariaLabel ?? this.inlineName ?? null;
  }

  @HostBinding('attr.tabindex')
  get hostTabIndex(): number | null {
    return this.tabIndex ?? null;
  }

  @HostBinding('style.cursor')
  get hostCursor(): string | null {
    return null;
  }

  @HostBinding('style.font-size')
  get hostFontSize(): string | null {
    return this.size ?? null;
  }

  @HostBinding('style.display') readonly hostDisplay = 'inline-flex';
  @HostBinding('style.align-items') readonly hostAlign = 'center';
  @HostBinding('style.justify-content') readonly hostJustify = 'center';
  @HostBinding('style.line-height') readonly hostLineHeight = '1';

  @HostBinding('class.wb-icon--transition')
  get hasTransition(): boolean {
    return this.transitionEnabled;
  }

  private readonly registry = inject(IconRegistryService);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject<Document>(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);

  private iconSubscription?: Subscription;
  private appliedAnimationClass?: string;
  private appliedThemeClasses: string[] = [];
  private appliedFontSetClasses: string[] = [];
  private appliedInlineAnimationStyles: string[] = [];
  private appliedInlineThemeStyles: string[] = [];
  private inlineName?: string;
  private inlineVariant?: string;
  private inlineSignature: string | null = null;
  private contentInitialized = false;
  private pendingRender = false;
  private scheduledContentRender = false;
  private scheduledTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentSvg?: SVGElement;
  private transitionEnabled = false;
  private morphingSvgs: { from: SVGElement | null; to: SVGElement | null } = { from: null, to: null };
  private morphingSubscriptions: Subscription[] = [];
  private rafIds: number[] = []; // Track requestAnimationFrame IDs para poder cancelarlos

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar si transition está presente (incluso sin valor)
    if (changes['transition']) {
      this.transitionEnabled = this.transition !== false && this.transition !== 'false';
    }

    // Optimización: Si solo cambia el color, animation, fontSet, ariaLabel, size, stroke o strokeWidth,
    // no necesitamos recargar el icono completo, solo actualizar estilos
    const onlyStyleChanges = 
      (changes['color'] || changes['animation'] || changes['fontSet'] || 
       changes['ariaLabel'] || changes['size'] || changes['stroke'] || changes['strokeWidth']) &&
      !changes['name'] && !changes['svgIcon'] && !changes['variant'];

    if (onlyStyleChanges) {
      // Solo actualizar estilos sin recargar el icono
      this.applyFontSet();
      this.applyTheme();
      this.applyAnimation();
      this.applyStroke();
      this.cdr.markForCheck();
      return;
    }


    // Detectar cambios en morphing
    if (changes['from'] || changes['to']) {
      if (this.from && this.to) {
        this.renderMorphing();
        this.cdr.markForCheck();
        return;
      }
    }

    // Si solo cambia active y ya hay morphing configurado, solo actualizar visibilidad
    if (changes['active'] && this.from && this.to && this.morphingSvgs.from && this.morphingSvgs.to) {
      this.updateMorphingVisibility();
      this.cdr.markForCheck();
      return;
    }

    if (
      changes['name'] ||
      changes['svgIcon'] ||
      changes['variant'] ||
      changes['animation'] ||
      changes['color'] ||
      changes['fontSet'] ||
      changes['ariaLabel'] ||
      changes['size'] ||
      changes['stroke'] ||
      changes['strokeWidth']
    ) {
      // Si name cambió a undefined/vacío, limpiar y salir temprano
      if (changes['name'] && !this.name && !this.svgIcon) {
        this.clearHostContent();
        this.iconSubscription?.unsubscribe();
        this.iconSubscription = undefined;
        this.cdr.markForCheck();
        return;
      }

      if (!this.contentInitialized && !this.name && !this.svgIcon) {
        this.pendingRender = true;
        return;
      }
      this.renderIcon();
      // Marcar para check con OnPush cuando cambian los inputs
      this.cdr.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    // Solo programar render si hay name, svgIcon o contenido inline
    if (this.name || this.svgIcon) {
      this.renderIcon();
    } else {
      this.scheduleContentRender(true);
    }
  }


  ngAfterContentChecked(): void {
    // IMPORTANTE: ngAfterContentChecked se ejecuta en cada ciclo de detección de cambios
    // Con OnPush y para evitar loops infinitos, NO procesamos contenido inline aquí
    // El contenido inline se procesa solo en ngAfterContentInit y cuando hay cambios explícitos
    // Esto previene loops infinitos de detección de cambios
  }

  ngOnDestroy(): void {
    this.iconSubscription?.unsubscribe();
    this.morphingSubscriptions.forEach(sub => sub.unsubscribe());
    this.morphingSubscriptions = [];
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout);
      this.scheduledTimeout = null;
    }
    // Cancelar todos los requestAnimationFrame pendientes
    this.rafIds.forEach(id => cancelAnimationFrame(id));
    this.rafIds = [];
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    this.iconClick.emit(event);
  }

  private updateInlineSignature(force = false): boolean {
    const text = this.elementRef.nativeElement.textContent ?? '';
    const normalized = text.trim();

    if (!force) {
      if (normalized === this.inlineSignature) {
        return false;
      }

      if (!normalized && this.inlineSignature) {
        return false;
      }
    }

    this.inlineSignature = normalized || this.inlineSignature || null;

    if (normalized) {
      const [rawName, rawVariant] = normalized.split(':');
      this.inlineName = rawName?.trim() || undefined;
      this.inlineVariant = rawVariant?.trim() || undefined;
    } else if (force && !this.inlineSignature) {
      this.inlineName = undefined;
      this.inlineVariant = undefined;
    }

    return !!normalized;
  }

  private captureInlineContent(): void {
    const text = this.elementRef.nativeElement.textContent ?? '';
    const normalized = text.trim();

    if (!normalized) {
      return;
    }

    const [rawName, rawVariant] = normalized.split(':');
    this.inlineName = rawName?.trim() || this.inlineName;
    this.inlineVariant = rawVariant?.trim() || this.inlineVariant;
    this.inlineSignature = this.inlineName ?? null;
  }

  private scheduleContentRender(force = false): void {
    // Evitar loops infinitos: si ya está programado y no es forzado, no hacer nada
    if (this.scheduledContentRender && !force) {
      return;
    }

    // Limpiar timeout anterior si existe
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout);
      this.scheduledTimeout = null;
    }

    this.scheduledContentRender = true;

    // Usar microtask para evitar loops infinitos
    Promise.resolve().then(() => {
      // Verificar que aún necesitamos renderizar
      if (!this.scheduledContentRender && !force) {
        return;
      }

      this.scheduledContentRender = false;
      this.scheduledTimeout = null;

      // Solo procesar si no hay name ni svgIcon (contenido inline)
      if (this.name || this.svgIcon) {
        return;
      }

      const changed = this.updateInlineSignature(force);

      if (changed || force || this.pendingRender) {
        this.pendingRender = false;
        this.captureInlineContent();
        // renderIcon() ya llama a markForCheck() internamente, no llamarlo aquí
        this.renderIcon();
      }
    });
  }

  private renderIcon(): void {
    // Si hay morphing configurado, usar renderMorphing en su lugar
    if (this.from && this.to) {
      this.renderMorphing();
      return;
    }

    // Validación temprana: si no hay name ni svgIcon, no renderizar
    if (!this.name && !this.svgIcon) {
      this.captureInlineContent();
      // Si después de capturar contenido inline aún no hay name, limpiar y salir
      if (!this.inlineName && !this.svgIcon) {
        this.clearHostContent();
        return;
      }
    }

    this.iconSubscription?.unsubscribe();
    this.iconSubscription = undefined;

    this.clearHostContent();
    this.applyFontSet();
    this.applyTheme();
    this.applyAnimation();

    const iconKey = this.resolveIconKey();

    if (!iconKey || !iconKey.name) {
      // No renderizar fallback si name es undefined/vacío para evitar loops
      this.clearHostContent();
      return;
    }

    this.iconSubscription = this.registry
      .getNamedSvgIcon(iconKey.name, iconKey.variant)
      .pipe(take(1))
      .subscribe({
        next: (svg) => {
          this.attachSvgToHost(svg);
          this.applyColorToSvg();
          this.applyStroke();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.warn(`[wb-icon] Unable to render icon "${iconKey.name}"`, error);
          this.iconError.emit(error);
          this.renderFallbackText();
          this.cdr.markForCheck();
        },
      });
  }

  private renderMorphing(): void {
    if (!this.from || !this.to) {
      return;
    }

    // Limpiar suscripciones anteriores
    this.morphingSubscriptions.forEach(sub => sub.unsubscribe());
    this.morphingSubscriptions = [];

    this.clearHostContent();
    this.applyFontSet();
    this.applyTheme();
    this.applyAnimation();

    const host = this.elementRef.nativeElement;
    const isActive = this.active === true;
    const fromVariant = this.variant;
    const toVariant = this.variant;

    // Crear contenedor para morphing
    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'wb-icon-morph-container');
    this.renderer.setStyle(container, 'position', 'relative');
    this.renderer.setStyle(container, 'width', '100%');
    this.renderer.setStyle(container, 'height', '100%');
    this.renderer.setStyle(container, 'display', 'inline-flex');
    this.renderer.setStyle(container, 'align-items', 'center');
    this.renderer.setStyle(container, 'justify-content', 'center');

    // Cargar icono "from"
    const fromSub = this.registry
      .getNamedSvgIcon(this.from, fromVariant)
      .pipe(take(1))
      .subscribe({
        next: (svg) => {
          const clonedSvg = svg.cloneNode(true) as SVGElement;
          this.prepareMorphingSvg(clonedSvg, !isActive);
          this.renderer.appendChild(container, clonedSvg);
          this.morphingSvgs.from = clonedSvg;
          this.applyColorToSvgElement(clonedSvg);
          this.applyStrokeToSvg(clonedSvg);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.warn(`[wb-icon] Unable to load morphing icon "from": "${this.from}"`, error);
        },
      });

    // Cargar icono "to"
    const toSub = this.registry
      .getNamedSvgIcon(this.to, toVariant)
      .pipe(take(1))
      .subscribe({
        next: (svg) => {
          const clonedSvg = svg.cloneNode(true) as SVGElement;
          this.prepareMorphingSvg(clonedSvg, isActive);
          this.renderer.appendChild(container, clonedSvg);
          this.morphingSvgs.to = clonedSvg;
          this.applyColorToSvgElement(clonedSvg);
          this.applyStrokeToSvg(clonedSvg);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.warn(`[wb-icon] Unable to load morphing icon "to": "${this.to}"`, error);
        },
      });

    this.morphingSubscriptions.push(fromSub, toSub);
    this.renderer.appendChild(host, container);
  }

  private prepareMorphingSvg(svg: SVGElement, isVisible: boolean): void {
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');

    if (!svg.getAttribute('width')) {
      svg.setAttribute('width', '1em');
    }

    if (!svg.getAttribute('height')) {
      svg.setAttribute('height', '1em');
    }

    // Estilos para morphing
    this.renderer.setStyle(svg, 'position', 'absolute');
    this.renderer.setStyle(svg, 'top', '50%');
    this.renderer.setStyle(svg, 'left', '50%');
    this.renderer.setStyle(svg, 'transform', 'translate(-50%, -50%)');
    
    // Transición suave para morphing
    this.renderer.setStyle(svg, 'transition', 'opacity 0.3s ease, transform 0.3s ease');
    
    // Estado inicial
    this.renderer.setStyle(svg, 'opacity', isVisible ? '1' : '0');
    this.renderer.setStyle(svg, 'transform', isVisible 
      ? 'translate(-50%, -50%) scale(1)' 
      : 'translate(-50%, -50%) scale(0.8)');
  }

  private applyColorToSvgElement(svg: SVGElement): void {
    if (!svg) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      // Remover el ID de la lista cuando se ejecute
      const index = this.rafIds.indexOf(rafId);
      if (index > -1) {
        this.rafIds.splice(index, 1);
      }
      
      if (!svg || !this.elementRef?.nativeElement) {
        return;
      }
      const host = this.elementRef.nativeElement;
      const computedColor = window.getComputedStyle(host).color;
      
      if (computedColor && computedColor !== 'rgba(0, 0, 0, 0)' && computedColor !== 'transparent') {
        this.setSvgFillAndStroke(svg, computedColor || 'currentColor');
      }
    });
    this.rafIds.push(rafId);
  }

  private updateMorphingVisibility(): void {
    if (!this.morphingSvgs.from || !this.morphingSvgs.to) {
      return;
    }

    const isActive = this.active === true;

    // Actualizar icono "from"
    this.renderer.setStyle(this.morphingSvgs.from, 'opacity', !isActive ? '1' : '0');
    this.renderer.setStyle(this.morphingSvgs.from, 'transform', !isActive 
      ? 'translate(-50%, -50%) scale(1)' 
      : 'translate(-50%, -50%) scale(0.8)');

    // Actualizar icono "to"
    this.renderer.setStyle(this.morphingSvgs.to, 'opacity', isActive ? '1' : '0');
    this.renderer.setStyle(this.morphingSvgs.to, 'transform', isActive 
      ? 'translate(-50%, -50%) scale(1)' 
      : 'translate(-50%, -50%) scale(0.8)');
  }

  private resolveIconKey(): IconKey | null {
    const explicitName = this.name;
    const resolvedName = explicitName ?? this.inlineName;

    if (this.svgIcon) {
      return { name: this.svgIcon, variant: this.variant ?? this.inlineVariant ?? undefined };
    }

    if (resolvedName) {
      return {
        name: resolvedName,
        variant: this.variant ?? this.inlineVariant ?? undefined,
      };
    }

    return null;
  }

  private attachSvgToHost(svg: SVGElement): void {
    const host = this.elementRef.nativeElement;

    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');

    if (!svg.getAttribute('width')) {
      svg.setAttribute('width', '1em');
    }

    if (!svg.getAttribute('height')) {
      svg.setAttribute('height', '1em');
    }

    this.currentSvg = svg;
    this.renderer.appendChild(host, svg);
  }

  private renderFallbackText(): void {
    const host = this.elementRef.nativeElement;

    if (this.name ?? this.inlineName) {
      this.renderer.setProperty(host, 'textContent', this.name ?? this.inlineName ?? '');
      return;
    }

    if (this.svgIcon) {
      const [, iconText] = this.svgIcon.split(':');
      this.renderer.setProperty(host, 'textContent', iconText ?? this.svgIcon);
    }
  }

  private clearHostContent(): void {
    const host = this.elementRef.nativeElement;

    while (host.firstChild) {
      this.renderer.removeChild(host, host.firstChild);
    }

    this.renderer.setProperty(host, 'textContent', '');
    this.currentSvg = undefined;
  }

  private applyFontSet(): void {
    const host = this.elementRef.nativeElement;

    if (this.appliedFontSetClasses.length) {
      this.appliedFontSetClasses.forEach((className) => this.renderer.removeClass(host, className));
      this.appliedFontSetClasses = [];
    }

    if (!this.fontSet) {
      return;
    }

    const classes = this.fontSet.split(' ').filter(Boolean);
    classes.forEach((className) => this.renderer.addClass(host, className));
    this.appliedFontSetClasses = classes;
  }

  private applyTheme(): void {
    const host = this.elementRef.nativeElement;

    this.clearThemeStyles(host);

    if (!this.color) {
      return;
    }

    const theme = this.registry.getTheme(this.color);
    
    if (theme) {
      // Primero aplicar los estilos inline (variables CSS)
      this.applyThemeStyles(host, theme);
      
      // Resolver el color real del tema
      let colorValue: string | null = null;
      
      if (theme.color) {
        // Si tiene color directo, usarlo
        colorValue = theme.color;
      } else if (theme.cssVariable) {
        // Si tiene cssVariable, obtener el valor de la variable o su fallback
        const variableValue = theme.inlineStyles?.[theme.cssVariable];
        if (variableValue) {
          // Extraer el valor del fallback de la variable CSS
          // Ejemplo: "var(--wb-color-primary, #246BFE)" -> "#246BFE"
          const fallbackMatch = variableValue.match(/var\([^,]+,\s*([^)]+)\)/);
          if (fallbackMatch) {
            colorValue = fallbackMatch[1].trim();
          } else {
            // Si no hay fallback, usar la variable directamente
            colorValue = `var(${theme.cssVariable})`;
          }
        } else {
          // Si no hay inlineStyles, usar la variable directamente
          colorValue = `var(${theme.cssVariable})`;
        }
      } else {
        // Fallback: intentar resolver el color
        colorValue = this.resolveThemeColor(theme);
      }
      
      if (colorValue) {
        this.renderer.setStyle(host, 'color', colorValue);
        this.appliedInlineThemeStyles.push('color');
      }
    } else {
      // No es un tema, usar el color directamente
      this.renderer.setStyle(host, 'color', this.color);
      this.appliedInlineThemeStyles.push('color');
    }

    if (this.currentSvg) {
      this.applyColorToSvg();
      this.applyStroke();
    }
  }

  private applyStroke(): void {
    if (!this.currentSvg && !this.morphingSvgs.from && !this.morphingSvgs.to) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      // Remover el ID de la lista cuando se ejecute
      const index = this.rafIds.indexOf(rafId);
      if (index > -1) {
        this.rafIds.splice(index, 1);
      }
      
      // Aplicar stroke al icono principal
      if (this.currentSvg && this.elementRef?.nativeElement) {
        this.applyStrokeToSvg(this.currentSvg);
      }

      // Aplicar stroke a los iconos de morphing
      if (this.morphingSvgs.from && this.elementRef?.nativeElement) {
        this.applyStrokeToSvg(this.morphingSvgs.from);
      }
      if (this.morphingSvgs.to && this.elementRef?.nativeElement) {
        this.applyStrokeToSvg(this.morphingSvgs.to);
      }
    });
    this.rafIds.push(rafId);
  }

  private applyStrokeToSvg(svg: SVGElement): void {
    if (!svg) {
      return;
    }

    // Aplicar stroke-width si está especificado
    if (this.strokeWidth !== undefined && this.strokeWidth !== null) {
      const strokeWidthValue = typeof this.strokeWidth === 'number' 
        ? `${this.strokeWidth}` 
        : String(this.strokeWidth);
      
      svg.setAttribute('stroke-width', strokeWidthValue);
      
      // Aplicar a todos los elementos que pueden tener stroke
      const elements = svg.querySelectorAll('path, circle, rect, ellipse, line, polyline, polygon, g');
      elements.forEach((element) => {
        (element as SVGElement).setAttribute('stroke-width', strokeWidthValue);
      });
    }

    // Aplicar stroke color si está especificado
    if (this.stroke) {
      let strokeColor: string;
      
      // Verificar si es un tema
      const theme = this.registry.getTheme(this.stroke);
      if (theme) {
        // Resolver el color del tema
        if (theme.color) {
          strokeColor = theme.color;
        } else if (theme.cssVariable) {
          const variableValue = theme.inlineStyles?.[theme.cssVariable];
          if (variableValue) {
            const fallbackMatch = variableValue.match(/var\([^,]+,\s*([^)]+)\)/);
            strokeColor = fallbackMatch ? fallbackMatch[1].trim() : `var(${theme.cssVariable})`;
          } else {
            strokeColor = `var(${theme.cssVariable})`;
          }
        } else {
          strokeColor = this.resolveThemeColor(theme) || this.stroke;
        }
      } else {
        // No es un tema, usar el valor directamente
        strokeColor = this.stroke;
      }

      svg.setAttribute('stroke', strokeColor);
      
      // Aplicar a todos los elementos que pueden tener stroke
      const elements = svg.querySelectorAll('path, circle, rect, ellipse, line, polyline, polygon, g');
      elements.forEach((element) => {
        const el = element as SVGElement;
        // Solo aplicar si el elemento tiene stroke o si strokeWidth está definido
        const hasStroke = el.getAttribute('stroke') !== null;
        const hasStrokeWidth = this.strokeWidth !== undefined && this.strokeWidth !== null;
        if (hasStroke || hasStrokeWidth) {
          el.setAttribute('stroke', strokeColor);
        }
      });
    } else if (this.strokeWidth !== undefined && this.strokeWidth !== null) {
      // Si solo hay strokeWidth pero no stroke, usar el color del icono
      const computedColor = this.getComputedColor();
      if (computedColor) {
        svg.setAttribute('stroke', computedColor);
        const elements = svg.querySelectorAll('path, circle, rect, ellipse, line, polyline, polygon, g');
        elements.forEach((element) => {
          const el = element as SVGElement;
          if (el.getAttribute('stroke-width')) {
            el.setAttribute('stroke', computedColor);
          }
        });
      }
    }
  }

  private clearThemeStyles(host: HTMLElement): void {
    this.appliedThemeClasses.forEach((className) => this.renderer.removeClass(host, className));
    this.appliedThemeClasses = [];
    this.appliedInlineThemeStyles.forEach((styleName) => this.renderer.removeStyle(host, styleName));
    this.appliedInlineThemeStyles = [];
  }

  private applyThemeStyles(host: HTMLElement, theme: IconThemeDefinition): void {
    if (theme.className) {
      const classes = theme.className.split(' ').filter(Boolean);
      classes.forEach((className) => this.renderer.addClass(host, className));
      this.appliedThemeClasses = classes;
    }

    if (theme.inlineStyles) {
      Object.entries(theme.inlineStyles).forEach(([key, value]) => {
        this.renderer.setStyle(host, key, value);
        this.appliedInlineThemeStyles.push(key);
      });
    }
  }

  private resolveThemeColor(theme: IconThemeDefinition): string {
    if (theme.color) {
      return theme.color;
    }

    if (theme.cssVariable) {
      const variableValue = theme.inlineStyles?.[theme.cssVariable];
      if (variableValue) {
        const fallbackMatch = variableValue.match(/var\([^,]+,\s*([^)]+)\)/);
        return fallbackMatch ? fallbackMatch[1].trim() : `var(${theme.cssVariable})`;
      }
      return `var(${theme.cssVariable})`;
    }

    return '';
  }

  private applyColorToSvg(): void {
    if (!this.currentSvg) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      // Remover el ID de la lista cuando se ejecute
      const index = this.rafIds.indexOf(rafId);
      if (index > -1) {
        this.rafIds.splice(index, 1);
      }
      
      if (this.currentSvg && this.elementRef?.nativeElement) {
        const computedColor = this.getComputedColor();
        this.setSvgFillAndStroke(this.currentSvg, computedColor || 'currentColor');
      }
    });
    this.rafIds.push(rafId);
  }

  private getComputedColor(): string | null {
    const host = this.elementRef.nativeElement;
    const computedColor = window.getComputedStyle(host).color;
    
    if (computedColor && computedColor !== 'rgba(0, 0, 0, 0)' && computedColor !== 'transparent') {
      return computedColor;
    }
    
    return null;
  }

  private setSvgFillAndStroke(svg: SVGElement, fillValue: string): void {
    this.applyFillToElement(svg, fillValue);
    
    const elements = svg.querySelectorAll('path, circle, rect, ellipse, line, polyline, polygon, g');
    elements.forEach((element) => {
      const el = element as SVGElement;
      this.applyFillToElement(el, fillValue);
      this.applyStrokeToElement(el, fillValue);
    });
  }

  private applyFillToElement(element: SVGElement, fillValue: string): void {
    const fill = element.getAttribute('fill');
    
    if (!fill || fill === 'none' || !this.isSpecialFill(fill)) {
      element.setAttribute('fill', fillValue);
    }
  }

  private applyStrokeToElement(element: SVGElement, strokeValue: string): void {
    const stroke = element.getAttribute('stroke');
    
    if (stroke && stroke !== 'none' && !this.isSpecialFill(stroke)) {
      element.setAttribute('stroke', strokeValue);
    }
  }

  private isSpecialFill(value: string): boolean {
    return /^(url\(|var\(|currentColor)/.test(value);
  }

  private applyAnimation(): void {
    const host = this.elementRef.nativeElement;

    if (this.appliedAnimationClass) {
      this.appliedAnimationClass.split(' ').forEach((className) => this.renderer.removeClass(host, className));
      this.appliedAnimationClass = undefined;
    }

    this.appliedInlineAnimationStyles.forEach((styleName) => this.renderer.removeStyle(host, styleName));
    this.appliedInlineAnimationStyles = [];

    if (!this.animation) {
      return;
    }

    const definition = this.registry.getAnimation(this.animation);

    if (definition) {
      if (definition.keyframes && !INSERTED_KEYFRAMES.has(this.animation)) {
        this.insertKeyframes(definition.keyframes, this.animation);
      }

      if (definition.className) {
        definition.className
          .split(' ')
          .filter(Boolean)
          .forEach((className) => this.renderer.addClass(host, className));
        this.appliedAnimationClass = definition.className;
      }

      if (definition.inlineStyles) {
        Object.entries(definition.inlineStyles).forEach(([name, value]) => {
          this.renderer.setStyle(host, name, value);
          this.appliedInlineAnimationStyles.push(name);
        });
      }

      return;
    }

    this.renderer.addClass(host, this.animation);
    this.appliedAnimationClass = this.animation;
  }

  private insertKeyframes(keyframes: string, animationName: string): void {
    if (!this.document?.head) {
      return;
    }

    const styleElement = this.document.createElement('style');
    styleElement.setAttribute('data-wb-icon-animation', animationName);
    styleElement.textContent = keyframes;
    this.document.head.appendChild(styleElement);
    INSERTED_KEYFRAMES.add(animationName);
  }
}

