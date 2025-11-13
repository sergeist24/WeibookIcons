# @weibook/icons-angular

Icon library for Angular 14.3+ that mirrors the ergonomics of `mat-icon` while adding first-class support for SVG variants, themes, and animations. The package is designed for frictionless consumption from npm and serves as the foundation for a future React wrapper.

---

## Features

- `<wb-icon>` component with the same DX as `<mat-icon>`
- Tree-shakeable icon registration via `provideWeibookIcons`
- Variant-aware registry (`download`, `download:filled`, `download:outlined`, etc.)
- Inline SVG rendering with caching, memoised HTTP fetches, and SSR-friendly guards
- Theming and colour tokens (`primary`, `success`, custom CSS variables)
- Reusable animation catalog (`spin`, `pulse`, `bounce`) with extensibility hooks
- Scripted SVG pipeline (SVGO optimisation + manifest generation)

---

## Installation

```bash
npm install @weibook/icons-angular
# or
yarn add @weibook/icons-angular
```

Peer requirements:

- Angular `>=14.3.0`
- `@angular/platform-browser` and `@angular/common/http`

---

## Quick start

Register icons and defaults once at application bootstrap (module-based or standalone).

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  WeibookIconModule,
  provideWeibookIconDefaults,
  provideWeibookIconManifest,
} from '@weibook/icons-angular';

@NgModule({
  imports: [BrowserModule, WeibookIconModule],
  providers: [
    // Default animations + themes
    ...provideWeibookIconDefaults(),
    // Register manifest generated from icons/ directory
    ...provideWeibookIconManifest(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Use the icon component anywhere in your templates:

```html
<wb-icon name="download" variant="filled" ariaLabel="Download file"></wb-icon>
<wb-icon svgIcon="system:alert" animation="pulse" color="warning"></wb-icon>
```

---

## CLI helpers

- `ng add @weibook/icons-angular` – prints setup instructions and reminds you to register providers
- `ng g @weibook/icons-angular:generate-icon download --variant=outlined` – scaffolds `icons/outlined/download.svg` with a placeholder and reminds you to rerun the manifest generator

---

## Inputs & outputs

| Input        | Type       | Description                                                                                               |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------- |
| `name`       | `string`   | Icon name registered in the registry (`download`)                                                         |
| `variant`    | `string`   | Variant key (`filled`, `outlined`, `round`, etc.)                                                         |
| `svgIcon`    | `string`   | Namespace-style lookup (`system:alert`) for icon sets                                                     |
| `animation`  | `string`   | Named animation (`spin`, `pulse`, `bounce`) or custom class                                               |
| `color`      | `string`   | Theme token (`primary`) or any CSS colour/variable                                                        |
| `fontSet`    | `string`   | Optional class list for font-based fallbacks                                                              |
| `ariaLabel`  | `string`   | Accessible label. When omitted the icon is hidden from assistive tech                                     |
| `tabIndex`   | `number`   | Optional keyboard focus. Defaults to `null`                                                               |

| Output       | Type     | Emitted when                                                                                               |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `iconError`  | `Event`  | The icon cannot be resolved (network error, missing registration, invalid SVG)                            |

---

## Registering icons

### 1. Generated manifest (recommended)

1. Add SVG files under `icons/<variant>/<name>.svg` (e.g. `icons/filled/download.svg`)
2. Run the pipeline to optimise SVGs and regenerate the manifest

   ```bash
   npm run icons:manifest
   ```

3. Provide the manifest in your app: `...provideWeibookIconManifest()`

### 2. Manual registration

```ts
import { provideWeibookIcons } from '@weibook/icons-angular';

providers: [
  ...provideWeibookIcons({
    defaultVariant: 'filled',
    icons: [
      {
        name: 'download',
        variant: 'filled',
        source: { url: '/assets/icons/download-filled.svg' },
      },
      {
        name: 'download',
        variant: 'outlined',
        source: { svgText: '<svg ...></svg>' },
      },
    ],
    themes: {
      primary: { cssVariable: '--brand-primary' },
    },
    animations: {
      wiggle: {
        className: 'animate-wiggle',
        inlineStyles: { animationDuration: '700ms' },
      },
    },
  }),
];
```

---

## Theming & colour strategy

- Built-in themes expose CSS variables: `primary`, `success`, `warning`, `danger`, `muted`
- Override or add themes via `provideWeibookIconThemes({ ... })`
- `color` input also accepts direct values (`#ff9800`, `rgb(...)`, `var(--token)`)
- Icons fall back to `aria-hidden="true"` when no label is provided; add `ariaLabel` when the icon conveys meaning

---

## Animations

- Default presets: `spin`, `pulse`, `bounce` (`provideWeibookIconDefaults`)
- Register custom animations with `provideWeibookIconAnimations`
- Each animation can ship inline styles and optional raw `@keyframes`
- The component injects keyframes at runtime once per animation and works on SSR-safe `DOCUMENT`

---

## Visual preview component

The library ships with a lightweight gallery to inspect registered icons quickly:

```ts
import { IconGalleryModule, provideWeibookIconManifest } from '@weibook/icons-angular';

@Component({
  standalone: true,
  selector: 'app-icon-preview',
  imports: [IconGalleryModule],
  template: `<wb-icon-gallery title="Filled icons" variant="filled"></wb-icon-gallery>`,
  providers: [...provideWeibookIconManifest()],
})
export class IconPreviewComponent {}
```

Drop `<wb-icon-gallery>` into any dev-only route or documentation page to get a responsive grid showing the current manifest (filterable by `variant`).

---

## Accessibility & security

- SVG content is sanitised with Angular’s `DomSanitizer` in `IconRegistryService`
- SVGO pipeline enforces the presence of `viewBox` for responsive scaling
- Icons default to `aria-hidden="true"` until `ariaLabel` is supplied
- Keyboard focus is opt-in via `tabIndex`
- `iconError` allows logging or alternate UI when assets are missing
- For automated checks, wire `axe-playwright` or `storybook-addon-a11y`; sample hooks live under the `testing-and-docs` task list

---

## Development scripts

| Script                  | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `npm run icons:manifest`| Optimise SVGs and regenerate the TypeScript manifest          |
| `npm run build`         | Generate manifest and build the Angular package               |
| `npm run lint`          | ESLint over library sources and tooling scripts               |
| `npm test`              | Placeholder for Karma/Jest suite (configured in later tasks)  |

Build output is emitted to `dist/weibook-icons-angular`. Publish from that folder via `npm publish dist/weibook-icons-angular`.

---

## Adding new icons

1. Drop raw SVGs into `icons/<variant>/`
2. Ensure strokes use `currentColor` and include a `viewBox`
3. Run `npm run icons:manifest`
4. Commit both the updated SVG and generated files under `projects/icons-angular/src/lib/generated/`

---

## Roadmap

- Jest-based headless tests for registry/component behaviour
- Storybook with interactive controls and axe accessibility CI
- Shared `@weibook/icon-core` package for future React bindings

Contributions are welcome! Open an issue or PR with proposals and we can iterate together.
