````markdown
# TECH02 -- Arquitectura Mínima (Versión Técnica Pura)

## 1. Resumen

Arquitectura mínima basada en Next.js 15 (App Router), con estado global
gestionado mediante Zustand y organización simple tipo monolito.

## 2. Alcance

Tres pantallas: Inicio, Duelo, Resultados.\
Flujo principal: playersQueue → current → next → eliminated.

## 3. Estructura de directorios

    app/
      page.tsx
      duel/page.tsx
      results/page.tsx

    lib/
      store/players.ts

    components/
      ui/
      duel/
      results/

## 4. Estado (Zustand)

``` ts
const usePlayersStore = create((set) => ({
  queue: [],
  current: null,
  next: null,
  eliminated: [],
  init: (players) => set({ queue: players, current: players[0], next: players[1] }),
  vote: (winner, loser) => { ... }
}));
```

## 5. Flujo lógico

1.  Inicio → carga de jugadores.\
2.  Duelo → current vs next.\
3.  Voto → loser a eliminated.\
4.  Avance → current = next; next = queue.shift().\
5.  Si queue vacía → Resultados.

## 6. Diagrama (Mermaid)

``` mermaid
flowchart TD
  A[Inicio] --> B[Duelo]
  B -->|Votar| C{Quedan jugadores?}
  C -->|Sí| B
  C -->|No| D[Resultados]
```

## 7. Decisiones técnicas

-   Usar Zustand por simplicidad y rendimiento.
-   Arquitectura A (simple) con posible migración futura a B (modular).
-   Next.js como único runtime.

````
