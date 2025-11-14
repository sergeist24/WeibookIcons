import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IconEditorModalComponent } from './icon-editor-modal/icon-editor-modal.component';
import {
  IconGalleryModule,
  provideWeibookIconDefaults,
  provideWeibookIconManifest,
  WeibookIconModule,
} from '@weibook/icons-angular';

@NgModule({
  declarations: [AppComponent, IconEditorModalComponent],
  imports: [BrowserModule, FormsModule, IconGalleryModule, WeibookIconModule],
  providers: [...provideWeibookIconDefaults(), ...provideWeibookIconManifest()],
  bootstrap: [AppComponent],
})
export class AppModule {}
