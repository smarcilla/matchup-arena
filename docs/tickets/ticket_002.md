# Ticket 002: Rediseño Visual Mobile-First para formato YouTube Shorts (9:16)

## 🎯 Objetivo

Transformar la app Matchup Arena en una experiencia visual inmersiva, moderna y adictiva optimizada para formato vertical 9:16 (mobile/YouTube Shorts/TikTok/Reels).

## 📊 Estado Actual (Análisis de v1)

**Capturas de referencia:** `docs/tickets/images/` → `home_v1.png`, `duels_v1.png`, `mvp_v1.png`

### Problemas identificados:

1. **Layout genérico**: Diseño horizontal tradicional web, no optimizado para vertical
2. **Colores planos**: Fondos grises estáticos (`bg-gray-50`), sin personalidad
3. **Cards básicas**: `PlayerCard` con fondo blanco plano, bordes simples
4. **Sin atmósfera**: Falta de gradientes, efectos de luz, partículas o dinamismo
5. **Tipografía conservadora**: Headers sin impacto visual
6. **VS badge simple**: Círculo rojo básico sin drama
7. **MVP screen aburrida**: Celebración poco épica

---

## 🎨 Visión de Diseño: "Arena Nocturna"

### Concepto Visual

- **Tema**: Arena de combate nocturna con luces de neón y efectos cinematográficos
- **Paleta**: Fondos oscuros (#0a0a0f a #1a1a2e) con acentos neón (cyan, magenta, dorado)
- **Atmósfera**: Gradientes sutiles, glows, efectos de luz ambiental

### Inspiración

- Interfaces de videojuegos competitivos (FIFA Ultimate Team, NBA 2K)
- Estética cyberpunk/neon noir
- Motion design de broadcasts deportivos

---

## 📐 Especificaciones Técnicas

### 1. Layout Global (9:16 Priority)

```
Viewport target: 390x844px (iPhone 14 Pro)
Max-width container: 430px centrado
Aspect-ratio lock: opcional para desktop (mostrar en frame vertical)
```

**Cambios en `layout.tsx`:**

- Fondo oscuro con gradiente sutil global
- Contenedor con max-width para simular móvil en desktop
- Meta viewport optimizado

### 2. Home Page (`app/page.tsx`)

**Header:**

- Logo/título con efecto glow animado
- Tagline con typing effect o fade-in secuencial
- Posible efecto de partículas sutiles en background

**Competition Cards (`CompetitionCard.tsx`):**

- Diseño card con glassmorphism (blur + transparencia)
- Icono/escudo de competición más prominente
- Efecto hover/tap con glow de borde
- Indicador visual de "caliente" o "nuevo"

### 3. Duel Page (`app/duel/[slug]/page.tsx`)

**Layout vertical optimizado:**

```
┌─────────────────────┐
│    Header (mini)    │
├─────────────────────┤
│                     │
│   PLAYER TOP CARD   │
│   (40% altura)      │
│                     │
├─────────────────────┤
│        VS           │
│   (badge épico)     │
├─────────────────────┤
│                     │
│  PLAYER BOTTOM CARD │
│   (40% altura)      │
│                     │
├─────────────────────┤
│  Progress + hints   │
└─────────────────────┘
```

**VS Badge:**

- Efecto de fuego/energía animado
- Pulso de luz continuo
- Posiblemente con líneas de energía conectando los jugadores

**Progress Bar:**

- Diseño minimalista neón
- Números de ronda con estilo arcade

### 4. Player Cards (`PlayerCard.tsx`)

**Diseño "Trading Card Premium":**

- Marco con gradiente metálico o neón
- Imagen del jugador con máscara diagonal o curva
- Nombre con sombra de texto dramática
- Efecto de brillo en hover/tap (shine sweep)
- Corner badges para stats opcionales
- Fondo con patrón sutil (líneas, hexágonos)

**Estados:**

- `idle`: Glow sutil de borde, listo para interacción
- `hover/tap`: Intensificación del glow, ligera elevación
- `winner`: Explosión de partículas doradas, borde dorado brillante, scale up
- `loser`: Desaturación + efecto de "desvanecimiento", scale down

### 5. MVP Victory Screen

**Celebración épica:**

- Confetti/partículas doradas cayendo
- Card del MVP centrada con animación de entrada dramática
- Texto "🏆 MVP 🏆" con efecto de brillo animado
- Rayos de luz desde detrás de la card
- Botones con estilo consistente con el tema
- Posible efecto de "pantalla rota" o impacto

---

## 🎬 Animaciones Requeridas

### CSS Animations (globals.css)

```css
/* Nuevas animaciones a implementar */
@keyframes glow-pulse      /* Pulso de brillo para bordes */
@keyframes shine-sweep     /* Barrido de brillo en cards */
@keyframes float           /* Flotación sutil para elementos */
@keyframes particle-rise   /* Partículas subiendo */
@keyframes victory-burst   /* Explosión de victoria */
@keyframes neon-flicker    /* Parpadeo neón sutil */
@keyframes energy-flow; /* Flujo de energía en VS */
```

### Transiciones

- Todas las transiciones: `duration-300` o `duration-500`
- Easing: `ease-out` para entradas, `ease-in-out` para loops
- Stagger en listas (delay secuencial)

---

## 🎨 Sistema de Colores

### Variables CSS (globals.css :root)

```css
/* Fondos */
--bg-primary: #0a0a0f;
--bg-secondary: #12121a;
--bg-card: rgba(255, 255, 255, 0.05);
--bg-card-hover: rgba(255, 255, 255, 0.1);

/* Acentos */
--accent-cyan: #00f5ff;
--accent-magenta: #ff00ff;
--accent-gold: #ffd700;
--accent-orange: #ff6b35;

/* Texto */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-muted: rgba(255, 255, 255, 0.4);

/* Estados */
--winner-glow: #22c55e;
--loser-fade: #ef4444;

/* Gradientes */
--gradient-card: linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta));
--gradient-vs: linear-gradient(180deg, #ff4500, #ff0000, #ff4500);
```

---

## 📁 Archivos a Modificar

| Archivo                          | Cambios                                          |
| -------------------------------- | ------------------------------------------------ |
| `app/globals.css`                | Nueva paleta de colores, animaciones, utilidades |
| `app/layout.tsx`                 | Contenedor 9:16, fondo global                    |
| `app/page.tsx`                   | Layout home vertical, header con efecto          |
| `app/duel/[slug]/page.tsx`       | Layout duelo vertical                            |
| `components/CompetitionCard.tsx` | Glassmorphism, efectos                           |
| `components/PlayerCard.tsx`      | Rediseño completo trading card                   |
| `components/DuelArena.tsx`       | VS épico, layout vertical, progress neón         |

### Nuevos componentes opcionales:

- `components/ParticleBackground.tsx` - Fondo con partículas
- `components/VSBadge.tsx` - Badge VS separado con animaciones
- `components/VictoryScreen.tsx` - Pantalla de victoria dedicada

---

## ✅ Criterios de Aceptación

1. [ ] App se ve correctamente en viewport 390x844 (iPhone 14 Pro)
2. [ ] En desktop, la app se presenta centrada simulando móvil vertical
3. [ ] Tema oscuro con acentos neón aplicado consistentemente
4. [ ] Player cards tienen diseño "trading card" premium
5. [ ] VS badge tiene animación de energía/fuego
6. [ ] Animaciones de winner/loser son dramáticas y satisfactorias
7. [ ] MVP screen tiene celebración épica con partículas
8. [ ] Todas las interacciones tienen feedback visual claro
9. [ ] Performance: Animaciones a 60fps, no layout shifts
10. [ ] Sin regresiones: Tests existentes siguen pasando

---

## 🚫 Fuera de Alcance (No hacer en este ticket)

- Sonidos/audio
- Compartir en redes sociales
- Cambios en lógica de negocio
- Nuevas rutas o páginas
- Internacionalización

---

## 📝 Notas de Implementación

1. **Mobile-first**: Escribir estilos base para móvil, usar `md:` solo para ajustes desktop
2. **Tailwind**: Usar clases de Tailwind donde sea posible, CSS custom solo para animaciones complejas
3. **Sin librerías nuevas**: Lograr efectos con CSS puro (no Framer Motion, no GSAP por ahora)
4. **Accesibilidad**: Mantener contraste de texto legible (WCAG AA mínimo)
5. **Reducción de movimiento**: Respetar `prefers-reduced-motion` para usuarios sensibles

---

## 🖼️ Referencia Visual Actual

Ver capturas en `docs/tickets/images/`:

- `home_v1.png` - Estado actual de la home
- `duels_v1.png` - Estado actual de la pantalla de duelos
- `mvp_v1.png` - Estado actual de la pantalla de MVP
