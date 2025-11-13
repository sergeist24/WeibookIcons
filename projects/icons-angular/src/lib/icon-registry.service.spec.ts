import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { IconRegistryService, provideWeibookIcons } from './icon-registry.service';

const OUTLINED_SVG = '<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="none" stroke="currentColor"/></svg>';

describe('IconRegistryService', () => {
  let service: IconRegistryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IconRegistryService,
        ...provideWeibookIcons({
          defaultVariant: 'outlined',
          icons: [
            {
              name: 'literal',
              variant: 'outlined',
              source: { svgText: OUTLINED_SVG },
            },
          ],
        }),
      ],
    });

    service = TestBed.inject(IconRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('returns cloned SVG elements for literal registrations', async () => {
    const first = await service.getNamedSvgIcon('literal').toPromise();
    const second = await service.getNamedSvgIcon('literal').toPromise();

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first).not.toBe(second);
    expect(first!.tagName.toLowerCase()).toBe('svg');
  });

  it('fetches SVGs from URLs once and caches the result', async () => {
    const url = '/assets/icons/cloud.svg';
    service.registerSvgIcon('cloud', { url }, { variant: 'outlined' });

    const promise = firstValueFrom(service.getNamedSvgIcon('cloud'));

    const request = httpMock.expectOne((req) => req.url.includes(url));
    request.flush('<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>');

    const svg = await promise;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');

    const cached = await firstValueFrom(service.getNamedSvgIcon('cloud'));
    expect(cached).not.toBe(svg);
  });

  it('resolves default variant when no variant is supplied', async () => {
    const literalSvg = '<svg viewBox="0 0 24 24"><rect width="24" height="24"/></svg>';
    service.registerSvgIcon('download', { svgText: literalSvg }, { variant: 'outlined' });

    const svg = await firstValueFrom(service.getNamedSvgIcon('download'));
    expect(svg).toBeTruthy();
  });

  it('stores and resolves themes and animations', () => {
    service.registerTheme('primary', { cssVariable: '--brand-primary' });
    service.registerAnimation('spin', {
      className: 'spin',
      inlineStyles: { animation: 'spin 1s linear infinite' },
    });

    expect(service.getTheme('primary')).toEqual({ cssVariable: '--brand-primary' });
    expect(service.getAnimation('spin')).toEqual({
      className: 'spin',
      inlineStyles: { animation: 'spin 1s linear infinite' },
    });
  });
});

