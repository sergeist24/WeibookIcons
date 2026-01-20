import { Component, OnInit } from '@angular/core';
import { IconRegistration } from '@weibook/icons-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Weibook Icons Demo';
  libraryVersion = '0.3.4';
  searchQuery = '';
  selectedIcon: IconRegistration | null = null;
  isModalOpen = false;
  clickCount = 0;
  isDarkMode = true; // Por defecto modo oscuro
  
  private readonly THEME_STORAGE_KEY = 'weibook-icons-theme';
  
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

  ngOnInit(): void {
    // Cargar preferencia del tema desde localStorage
    this.loadThemeFromStorage();
    // Inicializar tema al cargar (aplicar inmediatamente)
    this.applyTheme();
    // Forzar detección de cambios para asegurar que se aplique
    setTimeout(() => this.applyTheme(), 0);
  }

  private loadThemeFromStorage(): void {
    try {
      const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        this.isDarkMode = savedTheme === 'dark';
      }
    } catch (error) {
      // Si hay error al leer localStorage, usar el valor por defecto
      console.warn('Error al leer tema del localStorage:', error);
    }
  }

  private saveThemeToStorage(): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, this.isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Error al guardar tema en localStorage:', error);
    }
  }

  private applyTheme(): void {
    // Aplicar al body para estilos globales y para que la modal lo detecte
    document.body.classList.remove('dark-mode', 'light-mode');
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }

  handleIconClick(event: IconRegistration | MouseEvent): void {
    if ('name' in event) {
      // Es un IconRegistration
      this.selectedIcon = event as IconRegistration;
    this.isModalOpen = true;
    }
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

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.saveThemeToStorage();
    this.applyTheme();
  }
}
