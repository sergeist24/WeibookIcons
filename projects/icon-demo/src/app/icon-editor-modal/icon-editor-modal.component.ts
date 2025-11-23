import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IconRegistration, WB_ICON_ANIMATIONS, WB_ICON_THEMES, WB_ICON_MANIFEST } from '@weibook/icons-angular';

interface IconEditorConfig {
  size: string;
  sizeUnit: 'px' | 'rem';
  color: string;
  colorType: 'hex' | 'theme';
  animation: string;
  useNameAttribute: boolean;
  variant?: string;
  transition: boolean;
  useMorphing: boolean;
  morphingFrom?: string;
  morphingTo?: string;
  morphingActive: boolean;
  strokeWidth?: string;
  stroke?: string;
  strokeColorType: 'hex' | 'theme' | 'none';
  ariaLabel?: string;
}

@Component({
  selector: 'wb-icon-editor-modal',
  templateUrl: './icon-editor-modal.component.html',
  styleUrls: ['./icon-editor-modal.component.css'],
})
export class IconEditorModalComponent implements OnChanges, OnInit, OnDestroy {
  @Input() icon: IconRegistration | null = null;
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();

  private originalBodyOverflow: string = '';

  config: IconEditorConfig = {
    size: '64',
    sizeUnit: 'px',
    color: '#1f2937',
    colorType: 'hex',
    animation: '',
    useNameAttribute: false,
    variant: undefined,
    transition: false,
    useMorphing: false,
    morphingFrom: undefined,
    morphingTo: undefined,
    morphingActive: false,
    strokeWidth: undefined,
    stroke: undefined,
    strokeColorType: 'none',
    ariaLabel: undefined,
  };

  // Estado para tabs de código
  activeCodeTab: 'full' | 'name' = 'full';

  availableAnimations = Object.keys(WB_ICON_ANIMATIONS).sort();
  availableThemes = Object.keys(WB_ICON_THEMES);
  availableVariants: (string | undefined)[] = [undefined, 'filled', 'outlined'];
  
  // Mapeo de nombres de animaciones a descripciones más amigables
  getAnimationLabel(animation: string): string {
    const labels: { [key: string]: string } = {
      'spin': 'Rotación (Spin)',
      'rotate': 'Rotación Inversa',
      'pulse': 'Pulso',
      'bounce': 'Rebote',
      'shake': 'Sacudida',
      'fade': 'Desvanecimiento',
      'zoom': 'Zoom',
      'tada': 'Celebración (Tada)',
      'float': 'Flotación',
      'glow': 'Resplandor',
      'tilt': 'Inclinación',
      'flip': 'Volteo 3D',
      'rubber': 'Goma Elástica',
    };
    return labels[animation] || animation;
  }
  
  // Obtener todos los nombres únicos de iconos del manifest
  get availableIconsForMorphing(): string[] {
    const iconNames = new Set<string>();
    WB_ICON_MANIFEST.forEach(icon => {
      if (icon.name) {
        iconNames.add(icon.name);
      }
    });
    return Array.from(iconNames).sort();
  }

  get iconSize(): string {
    return `${this.config.size}${this.config.sizeUnit}`;
  }

  get iconColor(): string {
    if (this.config.colorType === 'theme') {
      return this.config.color;
    }
    return this.config.color;
  }

  get generatedCode(): string {
    if (!this.icon) {
      return '';
    }

    const parts: string[] = ['<wb-icon'];

    if (this.config.useMorphing && this.config.morphingFrom && this.config.morphingTo) {
      parts.push(`from="${this.config.morphingFrom}"`);
      parts.push(`to="${this.config.morphingTo}"`);
      parts.push(`[active]="${this.config.morphingActive}"`);
    } else if (this.config.useNameAttribute) {
      parts.push(`[name]="${this.icon.name}"`);
    } else {
      parts.push(`name="${this.icon.name}"`);
    }

    if (this.config.size) {
      parts.push(`size="${this.iconSize}"`);
    }

    if (this.config.color && !this.config.useMorphing) {
      if (this.config.colorType === 'theme') {
        parts.push(`color="${this.config.color}"`);
      } else {
        parts.push(`[color]="'${this.config.color}'"`);
      }
    }

    if (this.config.animation) {
      parts.push(`animation="${this.config.animation}"`);
    }

    if (this.config.variant && !this.config.useMorphing) {
      parts.push(`[variant]="${this.config.variant}"`);
    }

    if (this.config.transition) {
      parts.push('transition');
    }

    if (this.config.strokeWidth) {
      // Si es un número, usarlo directamente; si es string, entre comillas
      const strokeWidthValue = isNaN(Number(this.config.strokeWidth)) 
        ? `"${this.config.strokeWidth}"` 
        : this.config.strokeWidth;
      parts.push(`[strokeWidth]="${strokeWidthValue}"`);
    }

    if (this.config.stroke && this.config.strokeColorType !== 'none') {
      if (this.config.strokeColorType === 'theme') {
        parts.push(`stroke="${this.config.stroke}"`);
      } else {
        parts.push(`[stroke]="'${this.config.stroke}'"`);
      }
    }

    if (this.config.ariaLabel) {
      parts.push(`ariaLabel="${this.config.ariaLabel}"`);
    }

    parts.push('></wb-icon>');

    return parts.join(' ');
  }

  get iconNameCode(): string {
    if (!this.icon) {
      return '';
    }
    return this.icon.name;
  }

  get isNameTabDisabled(): boolean {
    return this.config.useMorphing;
  }

  ngOnInit(): void {
    // Guardar el overflow original del body
    this.originalBodyOverflow = document.body.style.overflow;
  }

  ngOnDestroy(): void {
    // Restaurar el overflow original del body
    document.body.style.overflow = this.originalBodyOverflow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon'] && this.icon) {
      this.config = {
        size: '64',
        sizeUnit: 'px',
        color: '#1f2937',
        colorType: 'hex',
        animation: '',
        useNameAttribute: false,
        variant: this.icon.variant,
        transition: false,
        useMorphing: false,
        morphingFrom: undefined,
        morphingTo: undefined,
        morphingActive: false,
        strokeWidth: undefined,
        stroke: undefined,
        strokeColorType: 'none',
        ariaLabel: undefined,
      };
      this.activeCodeTab = 'full';
    }

    // Bloquear/desbloquear scroll cuando la modal se abre/cierra
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.originalBodyOverflow;
      }
    }
  }

  handleClose(): void {
    this.modalClose.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.handleClose();
    }
  }

  handleCopyCode(): void {
    const codeToCopy = this.activeCodeTab === 'full' ? this.generatedCode : this.iconNameCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      const button = document.querySelector(`.icon-editor__copy-btn[data-tab="${this.activeCodeTab}"]`) as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }
    });
  }

  handleCodeTabChange(tab: 'full' | 'name'): void {
    // No permitir cambiar a la tab de nombre si morphing está activo
    if (tab === 'name' && this.config.useMorphing) {
      return;
    }
    this.activeCodeTab = tab;
  }

  toggleMorphingPlay(): void {
    this.config.morphingActive = !this.config.morphingActive;
  }

  handleSizeChange(value: string): void {
    this.config.size = value;
  }

  handleSizeUnitChange(unit: 'px' | 'rem'): void {
    this.config.sizeUnit = unit;
  }

  handleColorChange(value: string): void {
    this.config.color = value;
  }

  handleColorTypeChange(type: 'hex' | 'theme'): void {
    this.config.colorType = type;
    if (type === 'theme' && !this.availableThemes.includes(this.config.color)) {
      this.config.color = this.availableThemes[0] || 'primary';
    } else if (type === 'hex') {
      this.config.color = '#1f2937';
    }
  }

  handleAnimationChange(value: string): void {
    this.config.animation = value;
  }

  handleUseNameAttributeChange(value: boolean): void {
    this.config.useNameAttribute = value;
  }

  handleVariantChange(value: string | undefined): void {
    this.config.variant = value;
  }

  handleTransitionChange(value: boolean): void {
    this.config.transition = value;
  }

  handleUseMorphingChange(value: boolean): void {
    this.config.useMorphing = value;
    if (value && !this.config.morphingFrom) {
      this.config.morphingFrom = 'play';
      this.config.morphingTo = 'pause';
    }
    // Si se activa morphing y está en la tab de nombre, cambiar a código completo
    if (value && this.activeCodeTab === 'name') {
      this.activeCodeTab = 'full';
    }
    // Si se desactiva morphing, resetear el estado activo
    if (!value) {
      this.config.morphingActive = false;
    }
  }

  handleMorphingFromChange(value: string): void {
    this.config.morphingFrom = value;
  }

  handleMorphingToChange(value: string): void {
    this.config.morphingTo = value;
  }

  handleMorphingActiveChange(value: boolean): void {
    this.config.morphingActive = value;
  }

  handleStrokeWidthChange(value: string): void {
    // Si el valor está vacío o es solo espacios, establecer como undefined
    const trimmedValue = value?.trim();
    this.config.strokeWidth = trimmedValue && trimmedValue !== '' ? trimmedValue : undefined;
  }

  handleStrokeChange(value: string): void {
    this.config.stroke = value || undefined;
  }

  handleStrokeColorTypeChange(type: 'hex' | 'theme' | 'none'): void {
    this.config.strokeColorType = type;
    if (type === 'none') {
      this.config.stroke = undefined;
    } else if (type === 'theme' && !this.availableThemes.includes(this.config.stroke || '')) {
      this.config.stroke = this.availableThemes[0] || 'primary';
    } else if (type === 'hex') {
      this.config.stroke = '#000000';
    }
  }

  handleAriaLabelChange(value: string): void {
    this.config.ariaLabel = value || undefined;
  }
}

