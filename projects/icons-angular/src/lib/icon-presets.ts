import { provideWeibookIcons } from './icon-registry.service';
import { IconAnimationConfig, IconThemeConfig, ProvideWeibookProviders } from './icon.types';

const ROTATE_KEYFRAMES = `
@keyframes wb-icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;

const PULSE_KEYFRAMES = `
@keyframes wb-icon-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.92);
    opacity: 0.75;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`;

const BOUNCE_KEYFRAMES = `
@keyframes wb-icon-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20%);
  }
}
`;

const SHAKE_KEYFRAMES = `
@keyframes wb-icon-shake {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-12%);
  }
  40% {
    transform: translateX(10%);
  }
  60% {
    transform: translateX(-8%);
  }
  80% {
    transform: translateX(6%);
  }
}
`;

export const WB_ICON_ANIMATIONS: IconAnimationConfig = {
  spin: {
    className: 'wb-icon--spin',
    inlineStyles: {
      animation: 'wb-icon-spin 1.2s linear infinite',
      'transform-origin': 'center',
    },
    keyframes: ROTATE_KEYFRAMES,
  },
  pulse: {
    className: 'wb-icon--pulse',
    inlineStyles: {
      animation: 'wb-icon-pulse 1.1s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: PULSE_KEYFRAMES,
  },
  bounce: {
    className: 'wb-icon--bounce',
    inlineStyles: {
      animation: 'wb-icon-bounce 1.2s ease-in-out infinite',
      display: 'inline-flex',
    },
    keyframes: BOUNCE_KEYFRAMES,
  },
  shake: {
    className: 'wb-icon--shake',
    inlineStyles: {
      animation: 'wb-icon-shake 0.6s ease-in-out 0s infinite',
      'transform-origin': 'center',
    },
    keyframes: SHAKE_KEYFRAMES,
  },
};

export const WB_ICON_THEMES: IconThemeConfig = {
  primary: {
    cssVariable: '--wb-icon-color-primary',
    inlineStyles: {
      '--wb-icon-color-primary': 'var(--wb-color-primary, #5b21b6)',
    },
  },
  success: {
    cssVariable: '--wb-icon-color-success',
    inlineStyles: {
      '--wb-icon-color-success': 'var(--wb-color-success, #15803d)',
    },
  },
  warning: {
    cssVariable: '--wb-icon-color-warning',
    inlineStyles: {
      '--wb-icon-color-warning': 'var(--wb-color-warning, #c2410c)',
    },
  },
  danger: {
    cssVariable: '--wb-icon-color-danger',
    inlineStyles: {
      '--wb-icon-color-danger': 'var(--wb-color-danger, #b91c1c)',
    },
  },
  muted: {
    color: 'var(--wb-icon-color-muted, rgba(107, 114, 128, 1))',
  },
};

export const provideWeibookIconDefaults = (): ProvideWeibookProviders =>
  provideWeibookIcons({
    animations: WB_ICON_ANIMATIONS,
    themes: WB_ICON_THEMES,
  });

export const provideWeibookIconThemes = (themes: IconThemeConfig): ProvideWeibookProviders =>
  provideWeibookIcons({ themes });

export const provideWeibookIconAnimations = (animations: IconAnimationConfig): ProvideWeibookProviders =>
  provideWeibookIcons({ animations });

