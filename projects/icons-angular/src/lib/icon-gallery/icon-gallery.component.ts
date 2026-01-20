import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { IconRegistration } from '../icon.types';
import { IconRegistryService } from '../icon-registry.service';
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
export class IconGalleryComponent implements OnInit {
  private readonly registry = inject(IconRegistryService, { optional: true });

  @Input() title = 'Weibook Icons Preview';
  @Input() description = 'A quick visual of the icons registered in the manifest.';
  @Input() icons?: IconRegistration[];
  @Input() variant?: string;
  @Input() search = '';
  @Output() iconClick = new EventEmitter<IconRegistration>();

  private _displayIcons: IconRegistration[] = [];

  ngOnInit(): void {
    if (!this.icons) {
      this._displayIcons = WB_ICON_MANIFEST;
    } else {
      this._displayIcons = this.icons;
    }
  }

  get displayIcons(): IconRegistration[] {
    // If icons input changes, update the display icons
    if (this.icons) {
      this._displayIcons = this.icons;
    }
    return this._displayIcons;
  }

  get displayItems(): GalleryItem[] {
    const normalizedSearch = this.search.trim().toLowerCase();
    const icons = this.displayIcons;

    const filteredByVariant = this.variant
      ? icons.filter((icon) => icon.variant === this.variant)
      : icons;

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

  handleIconClick(icon: IconRegistration): void {
    this.iconClick.emit(icon);
  }
}

