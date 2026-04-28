<div align="center">
  <img src="https://camo.githubusercontent.com/7656c820967df6c936888efb66c104e3b828f25051da83a9857b34fcf30ba05f/68747470733a2f2f73332e776569626f6f6b2e636f2f7265637572736f732f6c6f676f2e737667" alt="Weibook Logo" width="200"/>
  
  # @weibook/icons-angular
  
  Librería de iconos para Angular 14.3+ que replica la ergonomía de `mat-icon` añadiendo soporte de primera clase para variantes SVG, temas, animaciones, morphing y personalización avanzada.
</div>

---

## ✨ Características

- **Componente `<wb-icon>`** con la misma experiencia de desarrollo que `<mat-icon>`
- **Registro tree-shakeable** de iconos mediante `provideWeibookIcons`
- **Soporte de variantes** (`download`, `download:filled`, `download:outlined`, etc.)
- **Renderizado inline de SVG** con caché, peticiones HTTP memoizadas y compatibilidad con SSR
- **Temas y tokens de color** (`primary`, `success`, variables CSS personalizadas)
- **14 animaciones predefinidas** (`spin`, `pulse`, `bounce`, `shake`, `fade`, `zoom`, `tada`, `float`, `glow`, `tilt`, `flip`, `rubber`, `rotate`) con hooks de extensibilidad
- **Icon Morphing** - Transiciones suaves entre dos iconos diferentes
- **Transiciones dinámicas** - Soporte para transiciones suaves en cambios de color, tamaño e icono
- **Stroke personalizable** - Control de grosor y color del borde de los iconos
- **Cambios dinámicos** - Soporte completo para bindings condicionales en todas las propiedades
- **Pipeline de SVG automatizado** (optimización SVGO + generación de manifest)
- **Compatibilidad con SSR** (Angular Universal)
- **Accesibilidad** integrada (ARIA, soporte para lectores de pantalla)
- **Modal de personalización** - Demo interactiva con editor visual completo

---

## 📦 Instalación

```bash
npm install @weibook/icons-angular
# o
yarn add @weibook/icons-angular
# o
pnpm add @weibook/icons-angular
```

### React (nuevo paquete)

```bash
npm install @weibook/icons-react
# o
yarn add @weibook/icons-react
# o
pnpm add @weibook/icons-react
```

### Requisitos de Peer Dependencies

- Angular `>=14.3.0`
- `@angular/platform-browser` y `@angular/common/http`
- RxJS `>=6.5.5`

---

## 🚀 Inicio Rápido

### Configuración con Módulos (Angular 14.3+)

Registra los iconos y valores por defecto una vez en el bootstrap de tu aplicación:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {
  WeibookIconModule,
  provideWeibookIconDefaults,
  provideWeibookIconManifest,
} from '@weibook/icons-angular';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule, // ⚠️ Requerido para cargar SVGs
    WeibookIconModule,
  ],
  providers: [
    // Animaciones y temas por defecto
    ...provideWeibookIconDefaults(),
    // Registra el manifest generado desde el directorio icons/
    ...provideWeibookIconManifest(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Configuración Standalone (Angular 15+)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  provideWeibookIconDefaults,
  provideWeibookIconManifest,
} from '@weibook/icons-angular';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // ⚠️ Requerido para cargar SVGs
    ...provideWeibookIconDefaults(),
    ...provideWeibookIconManifest(),
  ],
});
```

### Uso del Componente

Usa el componente de icono en cualquier parte de tus plantillas:

```html
<!-- Por nombre y variante -->
<wb-icon name="download" variant="filled" ariaLabel="Descargar archivo"></wb-icon>

<!-- Con contenido inline (estilo mat-icon) -->
<wb-icon>download</wb-icon>
<wb-icon>download:filled</wb-icon>

<!-- Con animación -->
<wb-icon name="download" animation="spin" ariaLabel="Descargando"></wb-icon>

<!-- Con tema de color -->
<wb-icon name="download" color="primary" ariaLabel="Descargar"></wb-icon>

<!-- Con tamaño personalizado -->
<wb-icon name="download" size="2rem" ariaLabel="Descargar"></wb-icon>

<!-- Con múltiples propiedades -->
<wb-icon 
  name="download" 
  variant="outlined" 
  animation="pulse" 
  color="success" 
  size="3rem"
  ariaLabel="Descarga completada">
</wb-icon>
```

### Uso en React

Para React, usa el provider para registrar el manifest y luego renderiza `WbIcon`:

```tsx
import { WeibookIconsProvider, WbIcon, WB_ICON_MANIFEST } from '@weibook/icons-react';

export function App() {
  return (
    <WeibookIconsProvider
      config={{
        defaultVariant: 'outlined',
        icons: WB_ICON_MANIFEST,
      }}
    >
      <WbIcon name="download" variant="filled" color="primary" size="28px" ariaLabel="Descargar" />
      <WbIcon name="loading" animation="spin" color="warning" ariaLabel="Cargando" />
    </WeibookIconsProvider>
  );
}
```

---

## 🛠️ Ayudantes CLI

### Agregar la librería

```bash
ng add @weibook/icons-angular
```

Este comando imprime instrucciones de configuración y te recuerda registrar los providers.

### Generar un nuevo icono

```bash
ng g @weibook/icons-angular:generate-icon download --variant=outlined
```

Esto crea un scaffold en `icons/outlined/download.svg` con un placeholder y te recuerda ejecutar nuevamente el generador de manifest.

---

## 📋 Inputs y Outputs

### Inputs

| Input        | Tipo                | Descripción                                                                                               |
| ------------ | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `name`       | `string`            | Nombre del icono registrado en el registro (`download`)                                                         |
| `variant`    | `string`            | Clave de variante (`filled`, `outlined`, `round`, etc.)                                                         |
| `svgIcon`    | `string`            | Búsqueda estilo namespace (`system:alert`) para conjuntos de iconos                                                     |
| `animation`  | `string`            | Animación nombrada (`spin`, `pulse`, `bounce`, `shake`, `fade`, `zoom`, `tada`, `float`, `glow`, `tilt`, `flip`, `rubber`, `rotate`) o clase personalizada                                               |
| `color`      | `string`            | Token de tema (`primary`) o cualquier color/variable CSS                                                        |
| `size`       | `string`            | Tamaño del icono usando `font-size` (ej: `"2rem"`, `"24px"`)                                                        |
| `fontSet`    | `string`            | Lista de clases opcional para fallbacks basados en fuente                                                              |
| `ariaLabel`  | `string`            | Etiqueta accesible. Cuando se omite, el icono se oculta de tecnologías de asistencia                                     |
| `tabIndex`   | `number`            | Enfoque de teclado opcional. Por defecto es `null`                                                               |
| `strokeWidth`| `string \| number`  | Grosor del borde del icono. Puede ser un número (ej: `2`) o string con unidades (ej: `"2px"`, `"0.5em"`) |
| `stroke`     | `string`            | Color del borde del icono. Puede ser un color directo, variable CSS o nombre de tema |
| `transition` | `boolean \| string` | Habilita transiciones suaves para cambios dinámicos (color, size, icon). Usa `transition` o `transition="true"` para activar |
| `from`       | `string`            | Nombre del icono de origen para morphing. Requiere `to` para activar morphing |
| `to`         | `string`            | Nombre del icono de destino para morphing. Requiere `from` para activar morphing |
| `active`     | `boolean`           | Controla qué icono se muestra cuando se usa morphing. `true` muestra `to`, `false` muestra `from` |

### Outputs

| Output       | Tipo     | Se emite cuando                                                                                               |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `iconError`  | `Event`  | El icono no puede ser resuelto (error de red, registro faltante, SVG inválido)                            |

---

## 🎭 Icon Morphing

La librería soporta transiciones suaves entre dos iconos diferentes, ideal para estados toggle (play/pause, like/unlike, etc.):

```html
<!-- Morphing básico -->
<wb-icon 
  from="play" 
  to="pause" 
  [active]="isPlaying"
  size="48px"
  color="primary">
</wb-icon>

<!-- Con animación durante el morphing -->
<wb-icon 
  from="heart" 
  to="heart-filled" 
  [active]="isLiked"
  animation="pulse"
  transition>
</wb-icon>

<!-- Cambio dinámico con condicionales -->
<wb-icon 
  [from]="iconFrom" 
  [to]="iconTo" 
  [active]="isActive"
  [color]="isActive ? 'primary' : 'gray'"
  [size]="isActive ? '32px' : '24px'"
  transition>
</wb-icon>
```

**Características del Morphing:**
- Transición suave de opacidad y transformación entre iconos
- Soporte para todas las propiedades dinámicas (color, size, animation)
- Compatible con transiciones CSS
- Optimizado para rendimiento con OnPush change detection

---

## 🎨 Transiciones Dinámicas

Habilita transiciones suaves para cambios dinámicos en color, tamaño e icono:

```html
<!-- Transiciones activadas -->
<wb-icon 
  name="star" 
  [color]="isFavorite ? 'warning' : 'gray'"
  [size]="isFavorite ? '32px' : '24px'"
  transition>
</wb-icon>

<!-- Cambio dinámico de icono con transición -->
<wb-icon 
  [name]="currentIcon"
  [color]="iconColor"
  transition>
</wb-icon>
```

**Propiedades que se animan:**
- `color` - Cambios de color suaves
- `size` - Cambios de tamaño suaves
- `fill` y `stroke` - Transiciones de relleno y borde
- `opacity` y `transform` - Para morphing y animaciones

---

## 🖌️ Stroke Personalizable

Controla el grosor y color del borde de los iconos:

```html
<!-- Stroke básico -->
<wb-icon 
  name="star" 
  strokeWidth="2"
  stroke="#000000">
</wb-icon>

<!-- Stroke con tema -->
<wb-icon 
  name="heart" 
  strokeWidth="1.5"
  stroke="primary">
</wb-icon>

<!-- Stroke dinámico -->
<wb-icon 
  name="circle" 
  [strokeWidth]="strokeThickness"
  [stroke]="strokeColor"
  transition>
</wb-icon>

<!-- Stroke con unidades -->
<wb-icon 
  name="square" 
  strokeWidth="0.5em"
  stroke="var(--my-color)">
</wb-icon>
```

**Notas:**
- `strokeWidth` acepta números o strings con unidades
- `stroke` puede ser un color directo, variable CSS o nombre de tema
- Si solo se especifica `strokeWidth`, se usa el color del icono automáticamente
- Compatible con transiciones cuando `transition` está activo

---

## 🔄 Cambios Dinámicos y Condicionales

Todas las propiedades soportan bindings dinámicos y condicionales:

```html
<!-- Cambio dinámico de icono -->
<wb-icon [name]="hidePassword ? 'visibility_off' : 'visibility'"></wb-icon>

<!-- Cambio dinámico de color -->
<wb-icon 
  name="favorite" 
  [color]="isFavorite ? 'warning' : 'gray'">
</wb-icon>

<!-- Cambio dinámico de animación -->
<wb-icon 
  name="loading" 
  [animation]="isLoading ? 'spin' : undefined">
</wb-icon>

<!-- Cambio dinámico de tamaño -->
<wb-icon 
  name="star" 
  [size]="isLarge ? '48px' : '24px'"
  transition>
</wb-icon>

<!-- Cambio dinámico de stroke -->
<wb-icon 
  name="circle" 
  [strokeWidth]="hasBorder ? '2' : undefined"
  [stroke]="hasBorder ? 'primary' : undefined">
</wb-icon>

<!-- Combinación de múltiples cambios dinámicos -->
<wb-icon 
  [name]="currentIcon"
  [color]="iconColor"
  [size]="iconSize"
  [animation]="iconAnimation"
  [strokeWidth]="strokeWidth"
  [stroke]="strokeColor"
  [transition]="enableTransitions">
</wb-icon>
```

---

## 📝 Registro de Iconos

### 1. Manifest Generado (Recomendado)

1. Agrega archivos SVG bajo `icons/<variante>/<nombre>.svg` (ej: `icons/filled/download.svg`)
2. Ejecuta el pipeline para optimizar SVGs y regenerar el manifest:

   ```bash
   npm run icons:manifest
   ```

3. Proporciona el manifest en tu app: `...provideWeibookIconManifest()`

### 2. Registro Manual

```typescript
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

## 🎨 Temas y Estrategia de Color

### Temas Integrados

La librería incluye los siguientes temas predefinidos:

- **`primary`**: Color primario de la marca (#246BFE)
- **`secondary`**: Color secundario (#030c1a)
- **`success`**: Color para acciones exitosas (#2DCE89)
- **`green`**: Verde (#0B9850)
- **`warning`**: Color para advertencias (#FF8C42)
- **`danger`**: Color para acciones peligrosas (#FB6340)
- **`orange`**: Naranja (#FB6340)
- **`gray`**, **`gray2`**, **`gray3`**: Escala de grises
- **`blue`**, **`blue2`**: Azules
- **`purple`**: Morado (#525f7f)
- **`muted`**: Color atenuado para elementos secundarios

Los temas integrados exponen variables CSS que puedes personalizar:

```css
:root {
  --wb-icon-color-primary: #246BFE;
  --wb-icon-color-success: #2DCE89;
  --wb-icon-color-warning: #FF8C42;
  --wb-icon-color-danger: #FB6340;
  --wb-icon-color-muted: rgba(107, 114, 128, 1);
}
```

### Personalización de Temas

Puedes sobrescribir o agregar temas mediante `provideWeibookIconThemes`:

```typescript
import { provideWeibookIconThemes } from '@weibook/icons-angular';

providers: [
  ...provideWeibookIconThemes({
    primary: { cssVariable: '--brand-primary' },
    custom: { color: '#ff9800' },
  }),
];
```

### Uso de Colores Directos

El input `color` también acepta valores directos:

```html
<wb-icon name="download" color="#ff9800"></wb-icon>
<wb-icon name="download" color="rgb(255, 152, 0)"></wb-icon>
<wb-icon name="download" color="var(--mi-variable-css)"></wb-icon>
```

---

## 🎬 Animaciones

### Animaciones Predefinidas

La librería incluye **14 animaciones predefinidas**:

#### Animaciones Básicas
- **`spin`**: Rotación continua (1.2s)
- **`rotate`**: Rotación inversa continua (1.2s)
- **`pulse`**: Pulso de escala y opacidad (1.1s)
- **`bounce`**: Rebote vertical (1.2s)
- **`shake`**: Sacudida horizontal (0.6s)
- **`fade`**: Desvanecimiento (1.5s)
- **`zoom`**: Zoom in/out (1s)

#### Animaciones Avanzadas
- **`tada`**: Celebración con rotación y escala (1s)
- **`float`**: Flotación suave (3s)
- **`glow`**: Resplandor pulsante (2s)
- **`tilt`**: Inclinación 3D (1s)
- **`flip`**: Volteo 3D (1s)
- **`rubber`**: Efecto de goma elástica (1s)

### Uso de Animaciones

```html
<!-- Animación simple -->
<wb-icon name="download" animation="spin"></wb-icon>

<!-- Animación dinámica con condicionales -->
<wb-icon 
  name="loading" 
  [animation]="isLoading ? 'spin' : undefined">
</wb-icon>

<!-- Múltiples animaciones (usando clases CSS personalizadas) -->
<wb-icon name="download" animation="custom-animation"></wb-icon>
```

### Registro de Animaciones Personalizadas

```typescript
import { provideWeibookIconAnimations } from '@weibook/icons-angular';

providers: [
  ...provideWeibookIconAnimations({
    wiggle: {
      className: 'wb-icon--wiggle',
      inlineStyles: {
        animation: 'wiggle 0.7s ease-in-out infinite',
      },
      keyframes: `
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
      `,
    },
  }),
];
```

Cada animación puede incluir estilos inline y `@keyframes` opcionales. El componente inyecta los keyframes en tiempo de ejecución una vez por animación y funciona con `DOCUMENT` seguro para SSR.

---

## 🖼️ Componente de Vista Previa Visual

La librería incluye una galería ligera para inspeccionar rápidamente los iconos registrados:

```typescript
import { IconGalleryModule, provideWeibookIconManifest } from '@weibook/icons-angular';

@Component({
  standalone: true,
  selector: 'app-icon-preview',
  imports: [IconGalleryModule],
  template: `
    <wb-icon-gallery title="Iconos Filled" variant="filled"></wb-icon-gallery>
    <wb-icon-gallery title="Todos los Iconos" [search]="searchQuery"></wb-icon-gallery>
  `,
  providers: [...provideWeibookIconManifest()],
})
export class IconPreviewComponent {
  searchQuery = '';
}
```

Coloca `<wb-icon-gallery>` en cualquier ruta solo para desarrollo o página de documentación para obtener una cuadrícula responsive que muestre el manifest actual (filtrable por `variant` y con búsqueda).

### Inputs del Componente de Galería

- `title`: Título de la sección de iconos
- `variant`: Filtrar por variante específica (`filled`, `outlined`, etc.)
- `search`: Cadena de búsqueda para filtrar iconos por nombre

---

## 🎨 Modal de Personalización (Demo)

La demo incluye un modal interactivo completo para personalizar iconos:

- **Preview en tiempo real** - Ve los cambios instantáneamente
- **Editor visual** - Controla todas las propiedades desde una interfaz amigable
- **Código generado** - Copia el código Angular listo para usar
- **Tabs de código** - Vista completa o solo el nombre del icono
- **Icon Morphing** - Prueba morphing con botón de play/pause
- **Todas las personalizaciones** - Color, tamaño, animación, stroke, transiciones, etc.

Accede a la modal haciendo clic en cualquier icono en la galería de la demo.

---

## ♿ Accesibilidad y Seguridad

### Seguridad

- **Sanitización de SVG**: El contenido SVG se sanitiza con `DomSanitizer` de Angular en `IconRegistryService`
- **Validación de viewBox**: El pipeline SVGO exige la presencia de `viewBox` para escalado responsive
- **Validación de URLs**: Se rechazan URLs no seguras

### Accesibilidad

- **ARIA por defecto**: Los iconos usan `aria-hidden="true"` por defecto hasta que se proporciona `ariaLabel`
- **Enfoque de teclado**: El enfoque de teclado es opcional mediante `tabIndex`
- **Manejo de errores**: `iconError` permite registrar o mostrar UI alternativa cuando los assets faltan
- **Lectores de pantalla**: Los iconos decorativos se ocultan automáticamente; los iconos con significado requieren `ariaLabel`

### Buenas Prácticas

```html
<!-- Icono decorativo (oculto de lectores de pantalla) -->
<wb-icon name="star"></wb-icon>

<!-- Icono con significado (visible para lectores de pantalla) -->
<wb-icon name="download" ariaLabel="Descargar archivo"></wb-icon>

<!-- Icono interactivo (con enfoque de teclado) -->
<wb-icon 
  name="settings" 
  ariaLabel="Configuración" 
  [tabIndex]="0"
  (click)="openSettings()">
</wb-icon>
```

---

## 🛠️ Scripts de Desarrollo

| Script                  | Propósito                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `npm run icons:manifest`| Optimiza SVGs y regenera el manifest de TypeScript          |
| `npm run icons:cli`     | CLI interactivo para gestión de iconos |
| `npm run icons:generate`| Genera el manifest de iconos |
| `npm run icons:validate`| Valida los iconos SVG |
| `npm run icons:stats`   | Muestra estadísticas de los iconos |
| `npm run icons:optimize`| Optimiza los SVGs |
| `npm run build:core`    | Compila `@weibook/icon-core` |
| `npm run build:angular` | Compila `@weibook/icons-angular` |
| `npm run build`         | Genera el manifest y construye el paquete Angular               |
| `npm run react:manifest`| Genera el manifest TypeScript para el paquete de React |
| `npm run build:react`   | Genera el manifest y compila `@weibook/icons-react` |
| `npm run publish:core`  | Publica `@weibook/icon-core` en npm |
| `npm run publish:react` | Publica `@weibook/icons-react` en npm |
| `npm run publish:angular` | Publica `@weibook/icons-angular` en npm |
| `npm run publish:all`   | Publica core -> react -> angular en orden |
| `npm run lint`          | ESLint sobre fuentes de la librería y scripts de herramientas               |
| `npm test`              | Suite de pruebas (Karma/Jest)  |

El output del build Angular se emite a `dist/weibook-icons-angular`.

---

## ➕ Agregar Nuevos Iconos

1. Coloca SVGs sin procesar en `icons/<variante>/`
2. Asegúrate de que los trazos usen `currentColor` e incluyan un `viewBox`
3. Ejecuta `npm run icons:manifest`
4. Confirma tanto el SVG actualizado como los archivos generados bajo `projects/icons-angular/src/lib/generated/`

### Ejemplo de SVG Válido

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" stroke="currentColor" stroke-width="2" fill="none"/>
</svg>
```

**Requisitos:**
- ✅ Debe tener `viewBox`
- ✅ Usar `currentColor` para colores (permite theming)
- ✅ Sin IDs duplicados
- ✅ Optimizado (el pipeline SVGO lo optimizará automáticamente)

---

## 📚 Ejemplos de Uso

### Ejemplo Básico

```html
<wb-icon name="download" variant="filled" ariaLabel="Descargar"></wb-icon>
```

### Ejemplo con Contenido Inline

```html
<wb-icon ariaLabel="Descargar">download</wb-icon>
<wb-icon ariaLabel="Descargar versión filled">download:filled</wb-icon>
```

### Ejemplo con Animación

```html
<wb-icon name="loading" animation="spin" ariaLabel="Cargando"></wb-icon>
<wb-icon name="notification" animation="pulse" ariaLabel="Nueva notificación"></wb-icon>
<wb-icon name="error" animation="shake" ariaLabel="Error"></wb-icon>
```

### Ejemplo con Tema

```html
<wb-icon name="check" color="success" ariaLabel="Completado"></wb-icon>
<wb-icon name="alert" color="warning" ariaLabel="Advertencia"></wb-icon>
<wb-icon name="delete" color="danger" ariaLabel="Eliminar"></wb-icon>
```

### Ejemplo con Tamaño Personalizado

```html
<wb-icon name="star" size="1rem" ariaLabel="Favorito"></wb-icon>
<wb-icon name="star" size="2rem" ariaLabel="Favorito"></wb-icon>
<wb-icon name="star" size="3rem" ariaLabel="Favorito"></wb-icon>
```

### Ejemplo con Icon Morphing

```html
<wb-icon 
  from="play" 
  to="pause" 
  [active]="isPlaying"
  size="48px"
  color="primary"
  transition
  ariaLabel="Reproducir/Pausar">
</wb-icon>
```

### Ejemplo con Stroke

```html
<wb-icon 
  name="star" 
  strokeWidth="2"
  stroke="primary"
  size="32px"
  ariaLabel="Favorito">
</wb-icon>
```

### Ejemplo con Cambios Dinámicos

```html
<wb-icon 
  [name]="hidePassword ? 'visibility_off' : 'visibility'"
  [color]="isFavorite ? 'warning' : 'gray'"
  [size]="isLarge ? '48px' : '24px'"
  [animation]="isLoading ? 'spin' : undefined"
  [strokeWidth]="hasBorder ? '2' : undefined"
  transition
  ariaLabel="Icono dinámico">
</wb-icon>
```

### Ejemplo Completo

```html
<wb-icon 
  name="download" 
  variant="outlined" 
  animation="pulse" 
  color="primary" 
  size="2.5rem"
  strokeWidth="1.5"
  stroke="primary"
  transition
  ariaLabel="Descargar archivo"
  [tabIndex]="0"
  (click)="downloadFile()"
  (iconError)="handleIconError($event)">
</wb-icon>
```

---

## 🔗 Enlaces Útiles

- **Demo Interactiva**: [https://sergeist24.github.io/WeibookIcons/](https://sergeist24.github.io/WeibookIcons/)
- **Repositorio**: [https://github.com/sergeist24/WeibookIcons](https://github.com/sergeist24/WeibookIcons)
- **Reportar Issues**: [https://github.com/sergeist24/WeibookIcons/issues](https://github.com/sergeist24/WeibookIcons/issues)
- **NPM Package**: [https://www.npmjs.com/package/@weibook/icons-angular](https://www.npmjs.com/package/@weibook/icons-angular)

---

## 🗺️ Roadmap

- [ ] Pruebas headless basadas en Jest para comportamiento de registro/componente
- [ ] Storybook con controles interactivos y CI de accesibilidad con axe
- [x] Paquete compartido `@weibook/icon-core` para bindings de React
- [ ] Soporte para más variantes de iconos
- [ ] Más animaciones predefinidas

---

## 🚢 Publicación Multi-Paquete

Para publicar los tres paquetes en npm sin romper dependencias, usa este orden:

1. `@weibook/icon-core`
2. `@weibook/icons-react` (depende de `icon-core`)
3. `@weibook/icons-angular` (peer de `icon-core`)

Comandos disponibles:

```bash
# Publicación secuencial completa
npm run publish:all

# O por paquete
npm run publish:core
npm run publish:react
npm run publish:angular
```

Recomendación antes de publicar:

```bash
npm run build
npm run test -- --watch=false --browsers=ChromeHeadless
```

---

## 🏷️ Versionado con Changesets

El repo está listo para versionado multi-paquete con [Changesets](https://github.com/changesets/changesets).

### Paquetes y workspaces

Los **workspaces de npm** solo incluyen `@weibook/icon-core` y `@weibook/icons-react`; Changesets puede versionarlos automáticamente a partir de archivos `.changeset/*.md`.

`@weibook/icons-angular` se construye en `dist/weibook-icons-angular/` con ng-packagr, por tanto **su versión** se indica manualmente editando `projects/icons-angular/package.json` cuando haya que publicar un release de ese paquete (anótalo también en CHANGELOG cuando toque).

### Flujo recomendado (local)

```bash
# 1) Describir el cambio (core / react)
npm run changeset

# 2) (Opcional) Si publicas Angular en este ciclo: sube semver en projects/icons-angular/package.json también

# 3) Bump de versiones + changelogs (o abre PR y lo hace CI)
npm run version:packages
```

Para publicación local tras build:

```bash
npm run release:ci
```

Eso ejecuta `npm run build`, `changeset publish` sobre los workspaces registrados y, al final, `tools/publish-angular-if-needed.mjs` intenta publicar Angular solo si esa versión aún no existe en npm.

### GitHub Actions — Release

El workflow [`.github/workflows/release.yml`](/.github/workflows/release.yml) en `push` a `main` usa `changesets/action` para:

- crear/actualizar el PR **«Version Packages»**, o bien
- ejecutar **`npm run release:ci`** y publicar a npm cuando el merge aplique bumps.

Requiere el secret **`NPM_TOKEN`** con permiso de publicación en npm.

Dependencias típicas:

- `@weibook/icons-react` depende por semver de `@weibook/icon-core`.
- `@weibook/icons-angular` declara `@weibook/icon-core` como peer dependency.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o PR con propuestas y podemos iterar juntos.

---

<div align="center">
  <p>Hecho con 💙 por <a href="https://weibook.co">Weibook</a></p>
</div>
