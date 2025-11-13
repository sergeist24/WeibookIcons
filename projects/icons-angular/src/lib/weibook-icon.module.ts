import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { WeibookIconComponent } from './weibook-icon.component';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [WeibookIconComponent],
  exports: [WeibookIconComponent],
})
export class WeibookIconModule {}

