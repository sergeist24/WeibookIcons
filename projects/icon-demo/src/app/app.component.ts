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
    console.log('Icon clicked!', event);
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
}
