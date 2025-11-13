import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconGalleryComponent } from './icon-gallery.component';
import { provideWeibookIcons } from '../icon-registry.service';
import { IconGalleryModule } from './icon-gallery.module';
import { IconRegistration } from '../icon.types';

describe('IconGalleryComponent', () => {
  let fixture: ComponentFixture<IconGalleryComponent>;
  let component: IconGalleryComponent;
  const MOCK_ICONS: IconRegistration[] = [
    { name: 'download', variant: 'filled', source: { svgText: '<svg viewBox="0 0 1 1"></svg>' } },
    { name: 'download', variant: 'outlined', source: { svgText: '<svg viewBox="0 0 1 1"></svg>' } },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconGalleryModule],
      providers: [
        ...provideWeibookIcons({
          icons: MOCK_ICONS,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IconGalleryComponent);
    component = fixture.componentInstance;
    component.icons = MOCK_ICONS;
    fixture.detectChanges();
  });

  it('renders a card per icon', () => {
    const cards = fixture.nativeElement.querySelectorAll('article');
    expect(cards.length).toBe(2);
  });

  it('filters by variant when provided', () => {
    component.variant = 'outlined';
    fixture.detectChanges();
    expect(component.displayItems.length).toBe(1);
    expect(component.displayItems[0].variant).toBe('outlined');
  });
});

