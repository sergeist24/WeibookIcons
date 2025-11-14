import { Component } from '@angular/core';
import { IconRegistration } from '@weibook/icons-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Weibook Icons Demo';
  searchQuery = '';
  selectedIcon: IconRegistration | null = null;
  isModalOpen = false;

  handleIconClick(event: IconRegistration | Event): void {
    const icon = event as IconRegistration;
    this.selectedIcon = icon;
    this.isModalOpen = true;
  }

  handleModalClose(): void {
    this.isModalOpen = false;
    this.selectedIcon = null;
  }
}
