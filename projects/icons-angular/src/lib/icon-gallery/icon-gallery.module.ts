import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WeibookIconModule } from '../weibook-icon.module';
import { IconGalleryComponent } from './icon-gallery.component';

@NgModule({
  imports: [CommonModule, WeibookIconModule],
  declarations: [IconGalleryComponent],
  exports: [IconGalleryComponent],
})
export class IconGalleryModule {}

