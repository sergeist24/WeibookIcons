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

const FADE_KEYFRAMES = `
@keyframes wb-icon-fade {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
`;

const ROTATE_KEYFRAMES_REVERSE = `
@keyframes wb-icon-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
`;


const ZOOM_KEYFRAMES = `
@keyframes wb-icon-zoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}
`;


const TADA_KEYFRAMES = `
@keyframes wb-icon-tada {
  0% {
    transform: scale(1) rotate(0deg);
  }
  10%, 20% {
    transform: scale(0.9) rotate(-3deg);
  }
  30%, 50%, 70%, 90% {
    transform: scale(1.1) rotate(3deg);
  }
  40%, 60%, 80% {
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
`;


const FLOAT_KEYFRAMES = `
@keyframes wb-icon-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
`;

const GLOW_KEYFRAMES = `
@keyframes wb-icon-glow {
  0%, 100% {
    filter: drop-shadow(0 0 2px currentColor);
    opacity: 1;
  }
  50% {
    filter: drop-shadow(0 0 8px currentColor);
    opacity: 0.9;
  }
}
`;

const TILT_KEYFRAMES = `
@keyframes wb-icon-tilt {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
}
`;

const FLIP_KEYFRAMES = `
@keyframes wb-icon-flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
`;

const RUBBER_KEYFRAMES = `
@keyframes wb-icon-rubber {
  0% {
    transform: scaleX(1);
  }
  30% {
    transform: scaleX(1.25) scaleY(0.75);
  }
  40% {
    transform: scaleX(0.75) scaleY(1.25);
  }
  50% {
    transform: scaleX(1.15) scaleY(0.85);
  }
  65% {
    transform: scaleX(0.95) scaleY(1.05);
  }
  75% {
    transform: scaleX(1.05) scaleY(0.95);
  }
  100% {
    transform: scaleX(1);
  }
}
`;


export const WB_ICON_ANIMATIONS: IconAnimationConfig = {
  // Animaciones básicas comunes
  spin: {
    className: 'wb-icon--spin',
    inlineStyles: {
      animation: 'wb-icon-spin 1.2s linear infinite',
      'transform-origin': 'center',
    },
    keyframes: ROTATE_KEYFRAMES,
  },
  rotate: {
    className: 'wb-icon--rotate',
    inlineStyles: {
      animation: 'wb-icon-rotate 1.2s linear infinite',
      'transform-origin': 'center',
    },
    keyframes: ROTATE_KEYFRAMES_REVERSE,
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
  fade: {
    className: 'wb-icon--fade',
    inlineStyles: {
      animation: 'wb-icon-fade 1.5s ease-in-out infinite',
    },
    keyframes: FADE_KEYFRAMES,
  },
  zoom: {
    className: 'wb-icon--zoom',
    inlineStyles: {
      animation: 'wb-icon-zoom 1s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: ZOOM_KEYFRAMES,
  },
  // Animaciones de librerías populares (Font Awesome, etc.)
  tada: {
    className: 'wb-icon--tada',
    inlineStyles: {
      animation: 'wb-icon-tada 1s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: TADA_KEYFRAMES,
  },
  // Animaciones únicas pero útiles
  float: {
    className: 'wb-icon--float',
    inlineStyles: {
      animation: 'wb-icon-float 3s ease-in-out infinite',
    },
    keyframes: FLOAT_KEYFRAMES,
  },
  glow: {
    className: 'wb-icon--glow',
    inlineStyles: {
      animation: 'wb-icon-glow 2s ease-in-out infinite',
    },
    keyframes: GLOW_KEYFRAMES,
  },
  tilt: {
    className: 'wb-icon--tilt',
    inlineStyles: {
      animation: 'wb-icon-tilt 2s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: TILT_KEYFRAMES,
  },
  flip: {
    className: 'wb-icon--flip',
    inlineStyles: {
      animation: 'wb-icon-flip 1s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: FLIP_KEYFRAMES,
  },
  rubber: {
    className: 'wb-icon--rubber',
    inlineStyles: {
      animation: 'wb-icon-rubber 0.8s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: RUBBER_KEYFRAMES,
  },
};

export const WB_ICON_THEMES: IconThemeConfig = {
  primary: {
    cssVariable: '--wb-icon-color-primary',
    inlineStyles: {
      '--wb-icon-color-primary': 'var(--wb-color-primary, #246BFE)',
    },
  },
  secondary: {
    cssVariable: '--wb-icon-color-secondary',
    inlineStyles: {
      '--wb-icon-color-secondary': 'var(--wb-color-secondary, #030c1a)',
    },
  },
  success: {
    cssVariable: '--wb-icon-color-success',
    inlineStyles: {
      '--wb-icon-color-success': 'var(--wb-color-success, #2DCE89)',
    },
  },
  green: {
    cssVariable: '--wb-icon-color-green',
    inlineStyles: {
      '--wb-icon-color-green': 'var(--wb-color-green, #0B9850)',
    },
  },
  warning: {
    cssVariable: '--wb-icon-color-warning',
    inlineStyles: {
      '--wb-icon-color-warning': 'var(--wb-color-warning, #FF8C42)',
    },
  },
  danger: {
    cssVariable: '--wb-icon-color-danger',
    inlineStyles: {
      '--wb-icon-color-danger': 'var(--wb-color-danger, #FB6340)',
    },
  },
  orange: {
    cssVariable: '--wb-icon-color-orange',
    inlineStyles: {
      '--wb-icon-color-orange': 'var(--wb-color-orange, #FB6340)',
    },
  },
  gray: {
    cssVariable: '--wb-icon-color-gray',
    inlineStyles: {
      '--wb-icon-color-gray': 'var(--wb-color-gray, #828286)',
    },
  },
  gray2: {
    cssVariable: '--wb-icon-color-gray-2',
    inlineStyles: {
      '--wb-icon-color-gray-2': 'var(--wb-color-gray-2, #8898aa)',
    },
  },
  gray3: {
    cssVariable: '--wb-icon-color-gray-3',
    inlineStyles: {
      '--wb-icon-color-gray-3': 'var(--wb-color-gray-3, #5f6368)',
    },
  },
  blue2: {
    cssVariable: '--wb-icon-color-blue-2',
    inlineStyles: {
      '--wb-icon-color-blue-2': 'var(--wb-color-blue-2, #32325d)',
    },
  },
  blue: {
    cssVariable: '--wb-icon-color-blue',
    inlineStyles: {
      '--wb-icon-color-blue': 'var(--wb-color-blue, #246BFE)',
    },
  },
  purple: {
    cssVariable: '--wb-icon-color-purple',
    inlineStyles: {
      '--wb-icon-color-purple': 'var(--wb-color-purple, #525f7f)',
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

