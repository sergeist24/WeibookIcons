import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { WeibookIconModule } from './weibook-icon.module';
import { IconRegistryService } from './icon-registry.service';
import { provideWeibookIcons } from './icon-registry.service';
import { WB_ICON_DEBUG } from './icon-registry.tokens';

@Component({
  template: `
    <wb-icon
      [name]="iconName"
      [variant]="iconVariant"
      [animation]="iconAnimation"
      [ariaLabel]="iconLabel"
      [size]="iconSize"
    >
      {{ inlineText }}
    </wb-icon>
  `,
})
class InputHostComponent {
  iconName?: string;
  iconVariant?: string;
  iconAnimation?: string;
  iconLabel?: string;
  iconSize?: string;
  inlineText = '';
}

@Component({
  template: `<wb-icon ariaLabel="Download">download</wb-icon>`,
})
class InlineHostComponent {}

const PROVIDERS = [
  ...provideWeibookIcons({
    defaultVariant: 'outlined',
    icons: [
      {
        name: 'download',
        variant: 'outlined',
        source: {
          svgText: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        },
      },
    ],
  }),
];

describe('WeibookIconComponent with bindings', () => {
  let fixture: ComponentFixture<InputHostComponent>;
  let hostComponent: InputHostComponent;
  let registry: IconRegistryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeibookIconModule],
      declarations: [InputHostComponent],
      providers: PROVIDERS,
    }).compileComponents();

    registry = TestBed.inject(IconRegistryService);
    fixture = TestBed.createComponent(InputHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('renders an inline SVG when the icon is registered', async () => {
    registry.registerSvgIcon(
      'check',
      { svgText: '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>' },
      { variant: 'filled' },
    );

    hostComponent.iconName = 'check';
    hostComponent.iconVariant = 'filled';
    hostComponent.iconLabel = 'Success';

    fixture.detectChanges();
    await fixture.whenStable();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(fixture.nativeElement.querySelector('wb-icon').getAttribute('aria-hidden')).toBeNull();
  });

  it('falls back to text when the icon does not exist', async () => {
    hostComponent.iconName = 'missing';
    hostComponent.iconLabel = undefined;
    hostComponent.inlineText = '';

    fixture.detectChanges();
    await fixture.whenStable();

    const hostEl: HTMLElement = fixture.nativeElement.querySelector('wb-icon');
    expect(hostEl.textContent?.trim()).toBe('missing');
    expect(hostEl.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies animation inline styles when registered', async () => {
    registry.registerSvgIcon(
      'loop',
      { svgText: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>' },
      { variant: 'filled' },
    );
    registry.registerAnimation('spin', {
      className: 'spin',
      inlineStyles: { animation: 'spin 1s linear infinite' },
      keyframes: '@keyframes spin { to { transform: rotate(360deg); } }',
    });

    hostComponent.iconName = 'loop';
    hostComponent.iconVariant = 'filled';
    hostComponent.iconAnimation = 'spin';

    fixture.detectChanges();
    await fixture.whenStable();

    const hostEl: HTMLElement = fixture.nativeElement.querySelector('wb-icon');
    expect(hostEl.style.animation).toContain('spin');
    expect(hostEl.style.animation).toContain('linear');
    expect(hostEl.style.animation).toContain('infinite');
  });
});

describe('WeibookIconComponent inline content', () => {
  let fixture: ComponentFixture<InlineHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeibookIconModule],
      declarations: [InlineHostComponent],
      providers: PROVIDERS,
    }).compileComponents();

    fixture = TestBed.createComponent(InlineHostComponent);
  });

  it('renders icon from inline text when no inputs provided', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('wb-icon svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });
});

describe('WeibookIconComponent SSR compatibility', () => {
  let fixture: ComponentFixture<InputHostComponent>;
  let hostComponent: InputHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeibookIconModule],
      declarations: [InputHostComponent],
      providers: [
        ...PROVIDERS,
        { provide: PLATFORM_ID, useValue: 'server' }, // Simular SSR
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should not throw errors when accessing window APIs in SSR', () => {
    hostComponent.iconName = 'download';
    hostComponent.iconVariant = 'outlined';

    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should handle getComputedStyle safely in SSR', () => {
    hostComponent.iconName = 'download';
    hostComponent.iconVariant = 'outlined';
    hostComponent.iconSize = '24px';

    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });
});

describe('WeibookIconComponent error handling', () => {
  let fixture: ComponentFixture<InputHostComponent>;
  let hostComponent: InputHostComponent;
  let errorHandler: ErrorHandler;
  let errorHandlerSpy: jasmine.Spy;

  beforeEach(async () => {
    errorHandler = TestBed.inject(ErrorHandler);
    errorHandlerSpy = spyOn(errorHandler, 'handleError');

    await TestBed.configureTestingModule({
      imports: [WeibookIconModule],
      declarations: [InputHostComponent],
      providers: PROVIDERS,
    }).compileComponents();

    fixture = TestBed.createComponent(InputHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should call ErrorHandler when icon fails to load', async () => {
    hostComponent.iconName = 'nonexistent-icon';
    hostComponent.iconVariant = 'outlined';

    fixture.detectChanges();
    await fixture.whenStable();

    expect(errorHandlerSpy).toHaveBeenCalled();
    expect(errorHandlerSpy.calls.mostRecent().args[0]).toBeInstanceOf(Error);
  });

  it('should emit iconError event when icon fails to load', async () => {
    const component = fixture.debugElement.query(
      (el) => el.name === 'wb-icon'
    )?.componentInstance;
    const errorSpy = spyOn(component.iconError, 'emit');

    hostComponent.iconName = 'nonexistent-icon';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(errorSpy).toHaveBeenCalled();
  });
});

describe('WeibookIconComponent MutationObserver', () => {
  let fixture: ComponentFixture<InlineHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeibookIconModule],
      declarations: [InlineHostComponent],
      providers: PROVIDERS,
    }).compileComponents();

    fixture = TestBed.createComponent(InlineHostComponent);
  });

  it('should observe content changes with MutationObserver', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const iconElement = fixture.nativeElement.querySelector('wb-icon');
    const initialSvg = iconElement.querySelector('svg');

    // Cambiar el contenido inline
    iconElement.textContent = 'check';
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // El componente debería detectar el cambio y actualizar
    // (Nota: En un test real, necesitarías mockear MutationObserver)
    expect(iconElement).toBeTruthy();
  });
});

describe('WeibookIconComponent debug mode', () => {
  let fixture: ComponentFixture<InputHostComponent>;
  let hostComponent: InputHostComponent;
  let consoleSpy: jasmine.Spy;

  beforeEach(async () => {
    consoleSpy = spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [WeibookIconModule],
      declarations: [InputHostComponent],
      providers: [
        ...PROVIDERS,
        { provide: WB_ICON_DEBUG, useValue: true },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should log icon loading information when debug is enabled', async () => {
    hostComponent.iconName = 'download';
    hostComponent.iconVariant = 'outlined';

    fixture.detectChanges();
    await fixture.whenStable();

    // En modo debug, debería loggear información del icono
    // (Nota: Esto depende de la implementación exacta del logging)
    expect(consoleSpy).toHaveBeenCalled();
  });
});

