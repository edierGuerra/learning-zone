## 📋 Índice
1. [Sistema de Breakpoints](#sistema-de-breakpoints)
2. [Variables CSS](#variables-css)
3. [Clases Utilitarias](#clases-utilitarias)
4. [Estrategia de Implementación](#estrategia-de-implementación)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Checklist de Componentes](#checklist-de-componentes)

## 🎨 Sistema de Breakpoints

### Breakpoints Definidos:
- **Mobile**: `max-width: 480px`
- **Tablet**: `max-width: 768px`
- **Desktop**: `min-width: 1024px`
- **Large Desktop**: `min-width: 1200px`

### Uso en CSS:
```css
/* Mobile first approach */
@media (max-width: 480px) {
  /* Estilos para mobile */
}

@media (max-width: 768px) {
  /* Estilos para tablet */
}

@media (min-width: 1024px) {
  /* Estilos para desktop */
}
```

## 🎨 Variables CSS

### Breakpoints:
```css
--mobile: 480px;
--tablet: 768px;
--desktop: 1024px;
--large-desktop: 1200px;
```

### Spacing:
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
```

### Font Sizes:
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

## 🛠️ Clases Utilitarias

### Grid System:
```css
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### Flexbox:
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
```

### Responsive Prefixes:
```css
.mobile:grid-cols-1    /* Solo en mobile */
.md:grid-cols-2        /* Tablet y superior */
.lg:grid-cols-3        /* Desktop y superior */
.xl:grid-cols-4        /* Large desktop y superior */
```

## 🚀 Estrategia de Implementación

### 1. **Enfoque Mobile-First**
- Comienza con estilos para mobile
- Usa `min-width` para breakpoints superiores
- Usa `max-width` para breakpoints inferiores

### 2. **Orden de Implementación**
1. **Layouts principales** (Header, Footer, Navbar)
2. **Páginas principales** (Landing, Dashboard, Auth)
3. **Componentes compartidos** (Cards, Buttons, Forms)
4. **Módulos específicos** (Courses, User, Notifications)

### 3. **Patrón de CSS Responsive**
```css
/* Estilos base (mobile) */
.component {
  width: 100%;
  padding: var(--spacing-sm);
  font-size: var(--font-size-base);
}

/* Tablet */
@media (max-width: 768px) {
  .component {
    padding: var(--spacing-md);
    font-size: var(--font-size-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## 📝 Ejemplos Prácticos

### Ejemplo 1: Card Component
```css
.card {
  width: 100%;
  max-width: 320px;
  padding: var(--spacing-md);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .card {
    max-width: 280px;
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .card {
    max-width: 100%;
  }
}
```

### Ejemplo 2: Grid Layout
```css
.courses-grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Ejemplo 3: Navigation
```css
.nav {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
    padding: var(--spacing-md);
  }
}
```
### 1. **Imágenes Responsive**
```css
img {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: cover;
}
```

### 2. **Textos Responsive**
```css
h1 { font-size: var(--font-size-2xl); }
@media (min-width: 768px) { h1 { font-size: var(--font-size-3xl); } }
@media (min-width: 1024px) { h1 { font-size: var(--font-size-4xl); } }
```

### 3. **Containers Responsive**
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-sm);
  max-width: var(--container-mobile);
}

@media (min-width: 768px) {
  .container {
    max-width: var(--container-tablet);
    padding: 0 var(--spacing-md);
  }
}
```

### 4. **Flexbox Responsive**
```css
.flex-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
    gap: var(--spacing-md);
  }
}
```

## 🔧 Herramientas de Desarrollo

### 1. **DevTools Responsive**
- Usa las herramientas de desarrollador del navegador
- Prueba diferentes tamaños de pantalla
- Verifica el comportamiento en diferentes dispositivos

### 2. **Testing Checklist**
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px - 1024px)
- [ ] Large Desktop (1025px+)

### 3. **Performance**
- Optimiza imágenes para diferentes tamaños
- Usa `will-change` para animaciones
- Reduce efectos 3D en mobile

## 📱 Consideraciones Especiales

### Touch Devices:
```css
@media (hover: none) {
  .hover-effect {
    display: none;
  }
}
```

### High DPI Screens:
```css
@media (-webkit-min-device-pixel-ratio: 2) {
  .image {
    image-rendering: -webkit-optimize-contrast;
  }
}
```

### Print Styles:
```css
@media print {
  .no-print { display: none; }
  .print-only { display: block; }
}

```

---

### Cambios para `NotificationItem.css`:

```css
/* ===== TABLET (>=768px) ===== */
@media (min-width: 768px) {
  .container-notification {
    padding: 1.5rem 2rem;
    max-width: 520px;
  }
  .title-notification {
    font-size: 1.5rem;
  }
  .message-notification {
    max-width: 320px;
    font-size: 1.05rem;
  }
}

/* ===== DESKTOP (>=1024px) ===== */
@media (min-width: 1024px) {
  .container-notification {
    max-width: 600px;
    padding: 2rem 2.5rem;
  }
  .title-notification {
    font-size: 1.7rem;
  }
  .message-notification {
    max-width: 400px;
    font-size: 1.1rem;
  }
}

/* ===== MOBILE PEQUEÑO (<=480px) ===== */
@media (max-width: 480px) {
  .container-notification {
    padding: 0.7rem 0.5rem;
    border-radius: 8px;
  }
  .title-notification {
    font-size: 1.05rem;
  }
  .date-notification {
    font-size: 0.7rem;
  }
  .message-notification {
    max-width: 98vw;
    font-size: 0.85rem;
    padding-bottom: 1px;
  }
  .btn-delete-notification {
    font-size: 1.2rem;
  }
}
```

---

### Cambios para `NotificationPanel.css`:

```css
<code_block_to_apply_changes_from>
```

---

Voy a agregarlos automáticamente al final de cada archivo.
