import { CSSProperties, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { useIconRegistry } from './icon-provider';

export interface WbIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  name: string;
  variant?: string;
  color?: string;
  size?: string | number;
  animation?: string;
  ariaLabel?: string;
}

const injectedKeyframes = new Set<string>();
const svgTextByUrl = new Map<string, string>();

const injectKeyframes = (keyframes: string): void => {
  if (typeof document === 'undefined' || injectedKeyframes.has(keyframes)) return;
  const style = document.createElement('style');
  style.setAttribute('data-wb-icon-keyframes', 'true');
  style.textContent = keyframes;
  document.head.appendChild(style);
  injectedKeyframes.add(keyframes);
};

export const WbIcon = ({ name, variant, color, size = '1.5rem', animation, ariaLabel, style, ...rest }: WbIconProps): JSX.Element | null => {
  const registry = useIconRegistry();
  const icon = useMemo(() => registry.getIcon(name, variant), [registry, name, variant]);
  const [svgTextFromUrl, setSvgTextFromUrl] = useState<string | null>(null);
  const theme = color ? registry.getTheme(color) : undefined;
  const animationDefinition = animation ? registry.getAnimation(animation) : undefined;

  useEffect(() => {
    if (animationDefinition?.keyframes) {
      injectKeyframes(animationDefinition.keyframes);
    }
  }, [animationDefinition]);

  useEffect(() => {
    setSvgTextFromUrl(null);
    if (!icon || !('url' in icon.source)) return;
    const url = icon.source.url;
    if (svgTextByUrl.has(url)) {
      setSvgTextFromUrl(svgTextByUrl.get(url) ?? null);
      return;
    }
    let isMounted = true;
    fetch(url)
      .then((response) => (response.ok ? response.text() : null))
      .then((svgText) => {
        if (!isMounted || !svgText) return;
        svgTextByUrl.set(url, svgText);
        setSvgTextFromUrl(svgText);
      })
      .catch(() => {
        // Ignore network errors to keep the component non-breaking.
      });
    return () => {
      isMounted = false;
    };
  }, [icon]);

  const resolvedColor = useMemo(() => {
    if (!color) return undefined;
    if (!theme) return color;
    if (theme.cssVariable) return `var(${theme.cssVariable})`;
    return theme.color ?? color;
  }, [color, theme]);

  if (!icon) {
    return null;
  }

  const svgMarkup = 'svgText' in icon.source ? icon.source.svgText : svgTextFromUrl;
  if (!svgMarkup) return null;

  const mergedStyle: CSSProperties = {
    display: 'inline-flex',
    width: size,
    height: size,
    color: resolvedColor,
    lineHeight: 0,
    ...(theme?.inlineStyles ?? {}),
    ...(animationDefinition?.inlineStyles ?? {}),
    ...style
  };

  return (
    <span
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={animationDefinition?.className}
      style={mergedStyle}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      {...rest}
    />
  );
};
