import { provideWeibookIcons } from './icon-registry.service';
import { IconAnimationConfig, IconThemeConfig, ProvideWeibookProviders } from './icon.types';
import {
  WB_ICON_ANIMATIONS as CORE_ICON_ANIMATIONS,
  WB_ICON_THEMES as CORE_ICON_THEMES,
} from '@weibook/icon-core';

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

const toKebabCase = (value: string): string => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const normalizeInlineStyles = (styles?: Record<string, string>): Record<string, string> | undefined => {
  if (!styles) {
    return undefined;
  }

  return Object.entries(styles).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[toKebabCase(key)] = value;
    return acc;
  }, {});
};

const normalizeAnimationConfig = (config: IconAnimationConfig): IconAnimationConfig =>
  Object.entries(config).reduce<IconAnimationConfig>((acc, [name, definition]) => {
    acc[name] = {
      ...definition,
      inlineStyles: normalizeInlineStyles(definition.inlineStyles),
    };
    return acc;
  }, {});

const normalizeThemeConfig = (config: IconThemeConfig): IconThemeConfig =>
  Object.entries(config).reduce<IconThemeConfig>((acc, [name, definition]) => {
    acc[name] = {
      ...definition,
      inlineStyles: normalizeInlineStyles(definition.inlineStyles),
    };
    return acc;
  }, {});

const ANGULAR_ONLY_ANIMATIONS: IconAnimationConfig = {
  rotate: {
    className: 'wb-icon--rotate',
    inlineStyles: {
      animation: 'wb-icon-rotate 1.2s linear infinite',
      'transform-origin': 'center',
    },
    keyframes: ROTATE_KEYFRAMES_REVERSE,
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
  tada: {
    className: 'wb-icon--tada',
    inlineStyles: {
      animation: 'wb-icon-tada 1s ease-in-out infinite',
      'transform-origin': 'center',
    },
    keyframes: TADA_KEYFRAMES,
  },
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

const ANGULAR_ONLY_THEMES: IconThemeConfig = {
  green: {
    cssVariable: '--wb-icon-color-green',
    inlineStyles: {
      '--wb-icon-color-green': 'var(--wb-color-green, #0B9850)',
    },
  },
  orange: {
    cssVariable: '--wb-icon-color-orange',
    inlineStyles: {
      '--wb-icon-color-orange': 'var(--wb-color-orange, #FB6340)',
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
};

export const WB_ICON_ANIMATIONS: IconAnimationConfig = {
  ...normalizeAnimationConfig(CORE_ICON_ANIMATIONS),
  ...ANGULAR_ONLY_ANIMATIONS,
};

export const WB_ICON_THEMES: IconThemeConfig = {
  ...normalizeThemeConfig(CORE_ICON_THEMES),
  ...ANGULAR_ONLY_THEMES,
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

