<div align="center">
  <img src="https://camo.githubusercontent.com/7656c820967df6c936888efb66c104e3b828f25051da83a9857b34fcf30ba05f/68747470733a2f2f73332e776569626f6f6b2e636f2f7265637572736f732f6c6f676f2e737667" alt="Weibook Logo" width="200"/>
  
  # @weibook/icons-angular
  
  Librería de iconos para Angular 14.3+ que replica la ergonomía de `mat-icon` añadiendo soporte de primera clase para variantes SVG, temas y animaciones.
</div>

---

## ✨ Características

- **Componente `<wb-icon>`** con la misma experiencia de desarrollo que `<mat-icon>`
- **Registro tree-shakeable** de iconos mediante `provideWeibookIcons`
- **Soporte de variantes** (`download`, `download:filled`, `download:outlined`, etc.)
- **Renderizado inline de SVG** con caché, peticiones HTTP memoizadas y compatibilidad con SSR
- **Temas y tokens de color** (`primary`, `success`, variables CSS personalizadas)
- **Catálogo de animaciones reutilizables** (`spin`, `pulse`, `bounce`, `shake`) con hooks de extensibilidad
- **Pipeline de SVG automatizado** (optimización SVGO + generación de manifest)
- **Compatibilidad con SSR** (Angular Universal)
- **Accesibilidad** integrada (ARIA, soporte para lectores de pantalla)

---

## 📦 Instalación

```bash
npm install @weibook/icons-angular
# o
yarn add @weibook/icons-angular
# o
pnpm add @weibook/icons-angular
```

### Requisitos de Peer Dependencies

- Angular `>=14.3.0`
- `@angular/platform-browser` y `@angular/common/http`

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

| Input        | Tipo       | Descripción                                                                                               |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------- |
| `name`       | `string`   | Nombre del icono registrado en el registro (`download`)                                                         |
| `variant`    | `string`   | Clave de variante (`filled`, `outlined`, `round`, etc.)                                                         |
| `svgIcon`    | `string`   | Búsqueda estilo namespace (`system:alert`) para conjuntos de iconos                                                     |
| `animation`  | `string`   | Animación nombrada (`spin`, `pulse`, `bounce`, `shake`) o clase personalizada                                               |
| `color`      | `string`   | Token de tema (`primary`) o cualquier color/variable CSS                                                        |
| `size`       | `string`   | Tamaño del icono usando `font-size` (ej: `"2rem"`, `"24px"`)                                                        |
| `fontSet`    | `string`   | Lista de clases opcional para fallbacks basados en fuente                                                              |
| `ariaLabel`  | `string`   | Etiqueta accesible. Cuando se omite, el icono se oculta de tecnologías de asistencia                                     |
| `tabIndex`   | `number`   | Enfoque de teclado opcional. Por defecto es `null`                                                               |

### Outputs

| Output       | Tipo     | Se emite cuando                                                                                               |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `iconError`  | `Event`  | El icono no puede ser resuelto (error de red, registro faltante, SVG inválido)                            |

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

- **`primary`**: Color primario de la marca
- **`success`**: Color para acciones exitosas
- **`warning`**: Color para advertencias
- **`danger`**: Color para acciones peligrosas
- **`muted`**: Color atenuado para elementos secundarios

Los temas integrados exponen variables CSS que puedes personalizar:

```css
:root {
  --wb-icon-primary: #246BFE;
  --wb-icon-success: #47C0C6;
  --wb-icon-warning: #FEB315;
  --wb-icon-danger: #B2168A;
  --wb-icon-muted: #6B7280;
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

La librería incluye las siguientes animaciones:

- **`spin`**: Rotación continua (1.2s)
- **`pulse`**: Pulso de escala y opacidad (1.1s)
- **`bounce`**: Rebote vertical (1.2s)
- **`shake`**: Sacudida horizontal (0.6s)

### Uso de Animaciones

```html
<!-- Animación simple -->
<wb-icon name="download" animation="spin"></wb-icon>

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
| `npm run build`         | Genera el manifest y construye el paquete Angular               |
| `npm run lint`          | ESLint sobre fuentes de la librería y scripts de herramientas               |
| `npm test`              | Suite de pruebas (Karma/Jest)  |

El output del build se emite a `dist/weibook-icons-angular`. Publica desde esa carpeta mediante `npm publish`.

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

### Ejemplo Completo

```html
<wb-icon 
  name="download" 
  variant="outlined" 
  animation="pulse" 
  color="primary" 
  size="2.5rem"
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
- [ ] Paquete compartido `@weibook/icon-core` para futuros bindings de React
- [ ] Soporte para más variantes de iconos
- [ ] Más animaciones predefinidas

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o PR con propuestas y podemos iterar juntos.

---

<div align="center">
  <p>Hecho con 💙 por <a href="https://weibook.co">Weibook</a></p>
</div>
