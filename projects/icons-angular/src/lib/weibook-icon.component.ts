import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
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
  @Input() animation?: string;
  @Input() color?: string;
  @Input() fontSet?: string;
  @Input() ariaLabel?: string;
  @Input() tabIndex: number | null = null;
  /**
   * Optional explicit size. When provided, overrides the computed font-size (e.g. "24px", "1.5em").
   */
  @Input() size?: string;

  @Output() iconError = new EventEmitter<unknown>();

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

  @HostBinding('style.font-size')
  get hostFontSize(): string | null {
    return this.size ?? null;
  }

  @HostBinding('style.display') readonly hostDisplay = 'inline-flex';
  @HostBinding('style.align-items') readonly hostAlign = 'center';
  @HostBinding('style.justify-content') readonly hostJustify = 'center';
  @HostBinding('style.line-height') readonly hostLineHeight = '1';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['name'] ||
      changes['svgIcon'] ||
      changes['variant'] ||
      changes['animation'] ||
      changes['color'] ||
      changes['fontSet'] ||
      changes['ariaLabel'] ||
      changes['size']
    ) {
      if (!this.contentInitialized && !this.name && !this.svgIcon) {
        this.pendingRender = true;
        return;
      }
      this.renderIcon();
    }
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.scheduleContentRender(true);
  }

  ngAfterContentChecked(): void {
    this.scheduleContentRender();
  }

  ngOnDestroy(): void {
    this.iconSubscription?.unsubscribe();
    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout);
      this.scheduledTimeout = null;
    }
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
    if (this.scheduledContentRender && !force) {
      return;
    }

    if (this.scheduledTimeout) {
      clearTimeout(this.scheduledTimeout);
      this.scheduledTimeout = null;
    }

    this.scheduledContentRender = true;

    this.scheduledTimeout = setTimeout(() => {
      this.scheduledContentRender = false;
      this.scheduledTimeout = null;
      const changed = this.updateInlineSignature(force);

      if (!this.name && !this.svgIcon && (changed || force || this.pendingRender)) {
        this.pendingRender = false;
        this.captureInlineContent();
        this.renderIcon();
        this.cdr.markForCheck();
      }
    }, 0);
  }

  private renderIcon(): void {
    if (!this.name && !this.svgIcon) {
      this.captureInlineContent();
    }

    this.iconSubscription?.unsubscribe();
    this.iconSubscription = undefined;

    this.clearHostContent();
    this.applyFontSet();
    this.applyTheme();
    this.applyAnimation();

    const iconKey = this.resolveIconKey();

    if (!iconKey) {
      this.renderFallbackText();
      return;
    }

    this.iconSubscription = this.registry
      .getNamedSvgIcon(iconKey.name, iconKey.variant)
      .pipe(take(1))
      .subscribe({
        next: (svg) => {
          this.attachSvgToHost(svg);
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

    if (this.appliedThemeClasses.length) {
      this.appliedThemeClasses.forEach((className) => this.renderer.removeClass(host, className));
      this.appliedThemeClasses = [];
    }

    this.appliedInlineThemeStyles.forEach((styleName) => this.renderer.removeStyle(host, styleName));
    this.appliedInlineThemeStyles = [];

    if (!this.color) {
      return;
    }

    const theme = this.registry.getTheme(this.color);

    if (theme) {
      if (theme.className) {
        const classes = theme.className.split(' ').filter(Boolean);
        classes.forEach((className) => this.renderer.addClass(host, className));
        this.appliedThemeClasses = classes;
      }

      if (theme.cssVariable) {
        this.renderer.setStyle(host, 'color', `var(${theme.cssVariable})`);
        this.appliedInlineThemeStyles.push('color');
      } else if (theme.color) {
        this.renderer.setStyle(host, 'color', theme.color);
        this.appliedInlineThemeStyles.push('color');
      }

      if (theme.inlineStyles) {
        Object.entries(theme.inlineStyles).forEach(([key, value]) => {
          this.renderer.setStyle(host, key, value);
          this.appliedInlineThemeStyles.push(key);
        });
      }

      return;
    }

    this.renderer.setStyle(host, 'color', this.color);
    this.appliedInlineThemeStyles.push('color');
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

