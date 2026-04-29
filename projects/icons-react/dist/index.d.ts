import { WeibookIconsConfig, IconRegistry, IconRegistration } from '@weibook/icon-core';
export * from '@weibook/icon-core';
import { HTMLAttributes } from 'react';

interface WeibookIconsProviderProps {
    config?: WeibookIconsConfig;
    children: React.ReactNode;
}
declare const WeibookIconsProvider: ({ config, children }: WeibookIconsProviderProps) => JSX.Element;
declare const useIconRegistry: () => IconRegistry;

interface WbIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    name: string;
    variant?: string;
    color?: string;
    size?: string | number;
    animation?: string;
    ariaLabel?: string;
}
declare const WbIcon: ({ name, variant, color, size, animation, ariaLabel, style, ...rest }: WbIconProps) => JSX.Element | null;

declare const WB_ICON_MANIFEST: IconRegistration[];

export { WB_ICON_MANIFEST, WbIcon, type WbIconProps, WeibookIconsProvider, type WeibookIconsProviderProps, useIconRegistry };
