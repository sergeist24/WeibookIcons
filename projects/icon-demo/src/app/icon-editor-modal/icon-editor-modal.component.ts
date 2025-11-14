import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IconRegistration, WB_ICON_ANIMATIONS, WB_ICON_THEMES } from '@weibook/icons-angular';

interface IconEditorConfig {
  size: string;
  sizeUnit: 'px' | 'rem';
  color: string;
  colorType: 'hex' | 'theme';
  animation: string;
  useNameAttribute: boolean;
  variant?: string;
}

@Component({
  selector: 'app-icon-editor-modal',
  templateUrl: './icon-editor-modal.component.html',
  styleUrls: ['./icon-editor-modal.component.css'],
})
export class IconEditorModalComponent implements OnChanges {
  @Input() icon: IconRegistration | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  config: IconEditorConfig = {
    size: '64',
    sizeUnit: 'px',
    color: '#1f2937',
    colorType: 'hex',
    animation: '',
    useNameAttribute: false,
    variant: undefined,
  };

  availableAnimations = Object.keys(WB_ICON_ANIMATIONS);
  availableThemes = Object.keys(WB_ICON_THEMES);
  availableVariants: (string | undefined)[] = [undefined, 'filled', 'outlined'];

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

    if (this.config.useNameAttribute) {
      parts.push(`[name]="${this.icon.name}"`);
    }

    if (this.config.size) {
      parts.push(`size="${this.iconSize}"`);
    }

    if (this.config.color) {
      parts.push(`color="${this.config.color}"`);
    }

    if (this.config.animation) {
      parts.push(`animation="${this.config.animation}"`);
    }

    if (this.config.variant) {
      parts.push(`[variant]="${this.config.variant}"`);
    }

    if (this.config.useNameAttribute) {
      parts.push('></wb-icon>');
    } else {
      parts.push(`>${this.icon.name}</wb-icon>`);
    }

    return parts.join(' ');
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
      };
    }
  }

  handleClose(): void {
    this.close.emit();
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
    navigator.clipboard.writeText(this.generatedCode).then(() => {
      const button = document.querySelector('.icon-editor__copy-btn') as HTMLButtonElement;
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
}

