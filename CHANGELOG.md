# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2025-11-26

### 🐛 Bug Fixes

- **Corrección crítica de loops infinitos con *ngIf**: Se corrigió un bug que causaba que la aplicación se congelara o explotara cuando se usaba `*ngIf` con el componente `wb-icon`. El problema estaba en los callbacks de `requestAnimationFrame` que no se cancelaban cuando el componente se destruía.
  - Se agregó rastreo de todos los `requestAnimationFrame` IDs en un array `rafIds`
  - Se cancelan todos los `requestAnimationFrame` pendientes en `ngOnDestroy()` usando `cancelAnimationFrame()`
  - Se agregaron verificaciones de seguridad para asegurar que `elementRef?.nativeElement` exista antes de manipularlo
  - Esto resuelve el problema cuando se usa `*ngIf` con condiciones dinámicas que cambian rápidamente

### 🔧 Mejoras

- **Mejor manejo de memoria**: Los callbacks de `requestAnimationFrame` ahora se limpian correctamente, evitando memory leaks
- **Pruebas mejoradas**: Se agregó una prueba en la demo que simula el caso del dashboard component para verificar el fix

## [0.3.1] - 2025-11-25

### 🐛 Bug Fixes

- **Corrección de bloqueo con *ngIf**: El componente ahora maneja correctamente cuando `name` es `undefined` o cambia dinámicamente, evitando loops infinitos de detección de cambios
- **Corrección en código generado**: La variante ahora se genera como atributo estático (`variant="filled"`) en lugar de binding (`[variant]="filled"`) en la modal de personalización
- **Mejoras en validación**: El componente valida tempranamente cuando `name` es `undefined` y limpia correctamente el contenido

### 🔧 Mejoras

- **Optimización de renderizado**: Mejoras en la detección de cambios para evitar renders innecesarios cuando solo cambian estilos
- **Mejor manejo de funciones**: El componente ahora maneja correctamente cuando se pasan funciones que devuelven nombres de iconos

## [0.3.0] - 2025-11-23

### 🎉 Major Feature Update

Esta es una actualización significativa que agrega múltiples funcionalidades nuevas mientras mantiene 100% de compatibilidad hacia atrás.

### ✨ Nuevas Funcionalidades

#### Icon Morphing
- **Transiciones suaves entre iconos**: Nueva funcionalidad que permite transiciones fluidas entre dos iconos diferentes
- **Inputs nuevos**: `from`, `to`, `active` para controlar el morphing
- **Casos de uso**: Perfecto para estados toggle (play/pause, like/unlike, etc.)
- **Ejemplo**:
  ```html
  <wb-icon from="play" to="pause" [active]="isPlaying"></wb-icon>
  ```

#### Transiciones Dinámicas
- **Soporte para transiciones suaves**: Nueva propiedad `transition` que habilita transiciones CSS en cambios dinámicos
- **Aplica a**: Cambios de color, tamaño, icono, stroke
- **Ejemplo**:
  ```html
  <wb-icon [color]="iconColor" [size]="iconSize" transition></wb-icon>
  ```

#### Stroke Personalizable
- **Control de borde**: Nuevas propiedades `strokeWidth` y `stroke` para personalizar el borde de los iconos
- **Soporte para**: Números, strings con unidades, temas y colores directos
- **Ejemplo**:
  ```html
  <wb-icon name="star" strokeWidth="2" stroke="primary"></wb-icon>
  ```

#### 10 Animaciones Nuevas
- **Expansión del catálogo**: De 4 a 14 animaciones predefinidas
- **Nuevas animaciones**:
  - `fade` - Desvanecimiento
  - `zoom` - Zoom in/out
  - `tada` - Celebración
  - `float` - Flotación suave
  - `glow` - Resplandor pulsante
  - `tilt` - Inclinación 3D
  - `flip` - Volteo 3D
  - `rubber` - Efecto de goma elástica
  - `rotate` - Rotación inversa
- **Animaciones existentes**: `spin`, `pulse`, `bounce`, `shake`

#### Tipos TypeScript Mejorados
- **Mejor autocompletado**: Nuevos tipos `IconAnimationName` y `IconThemeName`
- **Union types**: Incluyen todas las animaciones y temas predefinidos
- **Beneficios**: Autocompletado completo en IDEs y validación de tipos

### 🎨 Mejoras

#### Modal de Personalización (Demo)
- **Rediseño completo**: Modal interactivo con todas las funcionalidades
- **Nuevas características**:
  - Preview en tiempo real de todas las propiedades
  - Tabs de código (completo y solo nombre del icono)
  - Botón de play/pause para probar morphing
  - Controles para stroke y strokeWidth
  - Scroll bloqueado cuando la modal está abierta
  - Deshabilitación inteligente de tabs cuando morphing está activo

#### Documentación
- **README actualizado**: Documentación completa de todas las nuevas funcionalidades
- **Ejemplos**: Múltiples ejemplos de uso para cada nueva característica
- **Guías**: Instrucciones detalladas de implementación

#### Desarrollo
- **`.cursorrules`**: Archivo de reglas para desarrollo consistente
- **Mejoras en tipos**: Mejor soporte para autocompletado y validación

### 🔧 Compatibilidad

- ✅ **100% compatible hacia atrás**: Todas las funcionalidades existentes siguen funcionando
- ✅ **Sin breaking changes**: No se requieren cambios en código existente
- ✅ **Opcional**: Todas las nuevas funcionalidades son opcionales

### 📝 Notas Técnicas

- Los nuevos inputs son opcionales y no afectan el comportamiento existente
- Las animaciones nuevas se registran automáticamente con `provideWeibookIconDefaults()`
- El morphing requiere que ambos iconos (`from` y `to`) estén registrados
- Las transiciones se aplican solo cuando la propiedad `transition` está presente

---

## [0.2.11] - Versión anterior

### Características Base
- Componente `<wb-icon>` con soporte para variantes
- 4 animaciones predefinidas (`spin`, `pulse`, `bounce`, `shake`)
- Sistema de temas básico
- Galería de iconos
- Pipeline de SVG automatizado
- Compatibilidad con SSR

---

## Formato del Changelog

- **✨ Nuevas Funcionalidades**: Características nuevas agregadas
- **🎨 Mejoras**: Mejoras en funcionalidades existentes
- **🐛 Correcciones**: Correcciones de bugs
- **🔧 Compatibilidad**: Notas sobre compatibilidad y breaking changes
- **📝 Notas Técnicas**: Información técnica relevante

