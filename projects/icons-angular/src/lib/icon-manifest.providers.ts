import { provideWeibookIcons } from './icon-registry.service';
import { WB_ICON_MANIFEST } from './generated/icon-manifest';
import { ProvideWeibookProviders } from './icon.types';

export const provideWeibookIconManifest = (): ProvideWeibookProviders =>
  provideWeibookIcons({
    defaultVariant: 'outlined',
    icons: WB_ICON_MANIFEST,
  });

