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
  clickCount = 0;
  
  // Estados independientes para cada sección de la demo
  favorite1 = false; // Color Dinámico + Click Animation
  favorite2 = false; // Con Transiciones
  favorite3 = false; // Todo Dinámico
  
  size1 = '3rem'; // Tamaño Dinámico
  isLarge1 = false;
  
  size2 = '3rem'; // Con Transiciones
  isLarge2 = false;
  
  size3 = '2.5rem'; // Todo Dinámico
  isLarge3 = false;
  
  // Morphing
  isPlaying = false; // Para play/pause
  
  // Animación dinámica
  isAnimating = false; // Para animación dinámica
  
  // Stroke dinámico
  hasThickStroke = false; // Para stroke dinámico

  // Prueba con *ngIf
  activeSecondaryMenu: { icon?: string; title?: string } | null = null;
  
  // Simulación del dashboard component
  dashboardMenuType: 'reports' | 'sales-reports' | null = null;
  
  // Variables para pruebas con condiciones booleanas
  testString = '';
  testBoolean = false;
  testNumber = 0;
  
  // Variables para pruebas con funciones
  currentIconIndex = 0;
  iconList = ['heart', 'star', 'settings', 'download', 'upload'];

  handleIconClick(event: IconRegistration | Event): void {
    const icon = event as IconRegistration;
    this.selectedIcon = icon;
    this.isModalOpen = true;
  }

  handleModalClose(): void {
    this.isModalOpen = false;
    this.selectedIcon = null;
  }

  handlePlaygroundClick(event: MouseEvent): void {
    this.clickCount++;
  }

  // Métodos para cada sección independiente
  toggleFavorite1(): void {
    this.favorite1 = !this.favorite1;
  }

  toggleFavorite2(): void {
    this.favorite2 = !this.favorite2;
  }

  toggleFavorite3(): void {
    this.favorite3 = !this.favorite3;
  }

  toggleSize1(): void {
    this.isLarge1 = !this.isLarge1;
    this.size1 = this.isLarge1 ? '5rem' : '3rem';
  }

  toggleSize2(): void {
    this.isLarge2 = !this.isLarge2;
    this.size2 = this.isLarge2 ? '5rem' : '3rem';
  }

  toggleSize3(): void {
    this.isLarge3 = !this.isLarge3;
    this.size3 = this.isLarge3 ? '4rem' : '2.5rem';
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
  }

  toggleStroke(): void {
    this.hasThickStroke = !this.hasThickStroke;
  }

  toggleSecondaryMenu(): void {
    if (this.activeSecondaryMenu) {
      this.activeSecondaryMenu.icon = undefined;
      setTimeout(() => {
        this.activeSecondaryMenu = null;
      }, 500);
    } else {
      this.activeSecondaryMenu = { icon: 'setting' };
      setTimeout(() => {
        if (this.activeSecondaryMenu) {
          this.activeSecondaryMenu.icon = undefined;
        }
      }, 2000);
      setTimeout(() => {
        if (this.activeSecondaryMenu) {
          this.activeSecondaryMenu.icon = 'heart';
        }
      }, 4000);
    }
  }

  // Métodos para pruebas con condiciones
  toggleTestString(): void {
    this.testString = this.testString === 'ola' ? '' : 'ola';
  }

  toggleTestBoolean(): void {
    this.testBoolean = !this.testBoolean;
  }

  toggleTestNumber(): void {
    this.testNumber = this.testNumber === 0 ? 1 : 0;
  }

  // Funciones para pruebas con funciones
  getIconName(): string {
    return this.iconList[this.currentIconIndex];
  }
  
  getIconVariant(): string {
    return 'filled';
  }

  getIconNameWithCondition(): string {
    return this.testBoolean ? 'heart' : 'star';
  }

  getIconNameFromMenu(): string | undefined {
    return this.activeSecondaryMenu?.icon;
  }

  cycleIcon(): void {
    this.currentIconIndex = (this.currentIconIndex + 1) % this.iconList.length;
  }

  // Simulación del dashboard: cambiar entre menús
  openDashboardMenu(menuType: 'reports' | 'sales-reports'): void {
    if (this.dashboardMenuType === menuType) {
      this.dashboardMenuType = null;
      this.activeSecondaryMenu = null;
    } else {
      this.dashboardMenuType = menuType;
      if (menuType === 'reports') {
        this.activeSecondaryMenu = { icon: 'history', title: 'History' };
      } else {
        this.activeSecondaryMenu = { icon: 'bar-chart', title: 'TitleStats' };
      }
    }
  }

  // Simulación de cambios rápidos (para probar el bug)
  rapidToggleMenu(): void {
    let count = 0;
    const interval = setInterval(() => {
      if (count % 2 === 0) {
        this.dashboardMenuType = 'reports';
        this.activeSecondaryMenu = { icon: 'history', title: 'History' };
      } else {
        this.dashboardMenuType = 'sales-reports';
        this.activeSecondaryMenu = { icon: 'bar-chart', title: 'TitleStats' };
      }
      count++;
      if (count >= 10) {
        clearInterval(interval);
        this.dashboardMenuType = null;
        this.activeSecondaryMenu = null;
      }
    }, 100); // Cambio cada 100ms
  }
}
