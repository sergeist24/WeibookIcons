import { createContext, useContext, useMemo } from 'react';
import { IconRegistry, WB_ICON_ANIMATIONS, WB_ICON_THEMES, WeibookIconsConfig } from '@weibook/icon-core';

export interface WeibookIconsProviderProps {
  config?: WeibookIconsConfig;
  children: React.ReactNode;
}

const IconRegistryContext = createContext<IconRegistry | null>(null);

export const WeibookIconsProvider = ({ config, children }: WeibookIconsProviderProps): JSX.Element => {
  const registry = useMemo(() => {
    const mergedConfig: WeibookIconsConfig = {
      ...config,
      themes: { ...WB_ICON_THEMES, ...(config?.themes ?? {}) },
      animations: { ...WB_ICON_ANIMATIONS, ...(config?.animations ?? {}) }
    };
    return new IconRegistry(mergedConfig);
  }, [config]);

  return <IconRegistryContext.Provider value={registry}>{children}</IconRegistryContext.Provider>;
};

export const useIconRegistry = (): IconRegistry => {
  const registry = useContext(IconRegistryContext);
  if (!registry) {
    throw new Error('useIconRegistry must be used inside <WeibookIconsProvider>.');
  }
  return registry;
};
