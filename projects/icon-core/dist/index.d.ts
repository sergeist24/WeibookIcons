declare type IconVariant = string;
interface IconSvgSource {
    svgText: string;
}
interface IconUrlSource {
    url: string;
}
declare type IconSource = IconSvgSource | IconUrlSource;
interface IconRegistration {
    name: string;
    variant?: IconVariant;
    source: IconSource;
}
interface IconThemeDefinition {
    cssVariable?: string;
    color?: string;
    inlineStyles?: Record<string, string>;
}
interface IconAnimationDefinition {
    className: string;
    inlineStyles?: Record<string, string>;
    keyframes?: string;
}
declare type IconThemeConfig = Record<string, IconThemeDefinition>;
declare type IconAnimationConfig = Record<string, IconAnimationDefinition>;
interface WeibookIconsConfig {
    defaultVariant?: IconVariant;
    icons?: IconRegistration[];
    themes?: IconThemeConfig;
    animations?: IconAnimationConfig;
}

declare const WB_ICON_THEMES: IconThemeConfig;
declare const WB_ICON_ANIMATIONS: IconAnimationConfig;

declare class IconRegistry {
    private readonly icons;
    private readonly themes;
    private readonly animations;
    private defaultVariant?;
    constructor(config?: WeibookIconsConfig);
    applyConfig(config?: WeibookIconsConfig): void;
    getIcon(name: string, variant?: IconVariant): IconRegistration | undefined;
    getTheme(name: string): IconThemeDefinition | undefined;
    getAnimation(name: string): IconAnimationDefinition | undefined;
    private getKey;
}

export { type IconAnimationConfig, type IconAnimationDefinition, type IconRegistration, IconRegistry, type IconSource, type IconSvgSource, type IconThemeConfig, type IconThemeDefinition, type IconUrlSource, type IconVariant, WB_ICON_ANIMATIONS, WB_ICON_THEMES, type WeibookIconsConfig };
