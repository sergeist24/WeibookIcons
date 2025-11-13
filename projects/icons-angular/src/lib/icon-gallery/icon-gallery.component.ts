import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconRegistration } from '../icon.types';
import { WB_ICON_MANIFEST } from '../generated/icon-manifest';

interface GalleryItem extends IconRegistration {
  key: string;
}

@Component({
  selector: 'wb-icon-gallery',
  templateUrl: './icon-gallery.component.html',
  styleUrls: ['./icon-gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconGalleryComponent {
  @Input() title = 'Weibook Icons Preview';
  @Input() description = 'A quick visual of the icons registered in the manifest.';
  @Input() icons: IconRegistration[] = WB_ICON_MANIFEST;
  @Input() variant?: string;
  @Input() search = '';

  get displayItems(): GalleryItem[] {
    const normalizedSearch = this.search.trim().toLowerCase();

    const filteredByVariant = this.variant
      ? this.icons.filter((icon) => icon.variant === this.variant)
      : this.icons;

    const filteredBySearch = normalizedSearch
      ? filteredByVariant.filter((icon) => {
          const name = icon.name.toLowerCase();
          const variant = icon.variant?.toLowerCase() ?? '';
          if (name.includes(normalizedSearch)) {
            return true;
          }
          if (variant && variant.includes(normalizedSearch)) {
            return true;
          }
          return `${name}:${variant}`.includes(normalizedSearch);
        })
      : filteredByVariant;

    return filteredBySearch.map((icon) => ({
      ...icon,
      key: `${icon.name}:${icon.variant ?? 'default'}`,
    }));
  }

  trackByKey(_: number, item: GalleryItem): string {
    return item.key;
  }
}

