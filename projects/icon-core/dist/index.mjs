// src/presets.ts
var WB_ICON_THEMES = {
  primary: { cssVariable: "--wb-icon-color-primary", inlineStyles: { "--wb-icon-color-primary": "var(--wb-color-primary, #246BFE)" } },
  secondary: { cssVariable: "--wb-icon-color-secondary", inlineStyles: { "--wb-icon-color-secondary": "var(--wb-color-secondary, #030c1a)" } },
  success: { cssVariable: "--wb-icon-color-success", inlineStyles: { "--wb-icon-color-success": "var(--wb-color-success, #2DCE89)" } },
  warning: { cssVariable: "--wb-icon-color-warning", inlineStyles: { "--wb-icon-color-warning": "var(--wb-color-warning, #FF8C42)" } },
  danger: { cssVariable: "--wb-icon-color-danger", inlineStyles: { "--wb-icon-color-danger": "var(--wb-color-danger, #FB6340)" } },
  gray: { cssVariable: "--wb-icon-color-gray", inlineStyles: { "--wb-icon-color-gray": "var(--wb-color-gray, #828286)" } },
  muted: { color: "var(--wb-icon-color-muted, rgba(107, 114, 128, 1))" }
};
var WB_ICON_ANIMATIONS = {
  spin: {
    className: "wb-icon--spin",
    inlineStyles: { animation: "wb-icon-spin 1.2s linear infinite", transformOrigin: "center" },
    keyframes: "@keyframes wb-icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"
  },
  pulse: {
    className: "wb-icon--pulse",
    inlineStyles: { animation: "wb-icon-pulse 1.1s ease-in-out infinite", transformOrigin: "center" },
    keyframes: "@keyframes wb-icon-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(.92); opacity: .75; } 100% { transform: scale(1); opacity: 1; } }"
  },
  bounce: {
    className: "wb-icon--bounce",
    inlineStyles: { animation: "wb-icon-bounce 1.2s ease-in-out infinite", display: "inline-flex" },
    keyframes: "@keyframes wb-icon-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20%); } }"
  },
  shake: {
    className: "wb-icon--shake",
    inlineStyles: { animation: "wb-icon-shake .6s ease-in-out infinite", transformOrigin: "center" },
    keyframes: "@keyframes wb-icon-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-12%)} 40%{transform:translateX(10%)} 60%{transform:translateX(-8%)} 80%{transform:translateX(6%)} }"
  }
};

// src/icon-registry.ts
var INTERNAL_VARIANT_SEPARATOR = "::";
var IconRegistry = class {
  constructor(config) {
    this.icons = /* @__PURE__ */ new Map();
    this.themes = /* @__PURE__ */ new Map();
    this.animations = /* @__PURE__ */ new Map();
    this.applyConfig(config);
  }
  applyConfig(config) {
    if (!config) return;
    if (config.defaultVariant) this.defaultVariant = config.defaultVariant.trim();
    config.icons?.forEach((icon) => this.icons.set(this.getKey(icon.name, icon.variant), icon));
    Object.entries(config.themes ?? {}).forEach(([key, value]) => this.themes.set(key, value));
    Object.entries(config.animations ?? {}).forEach(([key, value]) => this.animations.set(key, value));
  }
  getIcon(name, variant) {
    const explicit = this.icons.get(this.getKey(name, variant));
    if (explicit) return explicit;
    if (!variant && this.defaultVariant) return this.icons.get(this.getKey(name, this.defaultVariant));
    return this.icons.get(this.getKey(name));
  }
  getTheme(name) {
    return this.themes.get(name);
  }
  getAnimation(name) {
    return this.animations.get(name);
  }
  getKey(name, variant) {
    const normalized = name.trim();
    if (!normalized) throw new Error("Icon name cannot be empty.");
    return variant?.trim() ? `${normalized}${INTERNAL_VARIANT_SEPARATOR}${variant.trim()}` : normalized;
  }
};
export {
  IconRegistry,
  WB_ICON_ANIMATIONS,
  WB_ICON_THEMES
};
