# Prompt para Claude Opus 4.5 — Modificación de MatchUp Arena para usar lectura directa desde Neon con Prisma (Modo A)

## CONTEXTO Y ROL

Actúas como **arquitecto senior de Next.js + Prisma + Neon**.  
Tu tarea es **modificar el proyecto MatchUp Arena** para que deje de usar datos locales o JSONs estáticos y pase a **consumir directamente el modelo real de datos** definido por `matchup-arena-dashboard`, utilizando **Prisma + PostgreSQL (Neon)** en modo **solo lectura**.

Toda la información del modelo, arquitectura, relaciones y flujos proviene del informe técnico previamente generado (Competition → Matchday → Player).  
Tu misión es aplicar esas especificaciones de forma estricta para sincronizar las dos apps.

---

## OBJETIVO PRINCIPAL

Actualizar MatchUp Arena para que:

1. **Use Prisma Client** para consultar los datos reales del dashboard.
2. **Conecte a la BD Neon** usando `DATABASE_URL` y la configuración estándar de Prisma.
3. **Obtenga las entidades desde la BD real**:
   - Lista de competiciones
   - Jornada seleccionada
   - Jugadores ordenados por ranking
4. **Consuma imágenes directamente desde los URLs en Vercel Blob** (ya presentes en el campo `image`).
5. **Elimine cualquier dependencia de datos locales, JSON o mocks.**

No debe escribir en la BD: solo lectura segura.

---

## TAREAS QUE DEBES REALIZAR

### 1. Añadir Prisma a MatchUp Arena

- Instalar `prisma` y `@prisma/client`
- Copiar o vincular el schema real del dashboard (el mismo que en el informe)
- Generar cliente Prisma en el proyecto
- Crear `/lib/prisma.ts` con patrón Singleton idéntico al dashboard

### 2. Implementar conexión segura con Neon

- Usar variable `DATABASE_URL`
- Configurar cliente Prisma para “read-only usage” (solo queries)
- Evitar migraciones desde esta app

### 3. Reemplazar la fuente de datos de MatchUp Arena

- Donde antes se usaban arrays, JSONs o mocks, sustituir por consultas Prisma:
  - `prisma.competition.findMany()`
  - `prisma.matchday.findUnique()`
  - `prisma.player.findMany({ orderBy: { ranking: 'asc' } })`

### 4. Cargar los datos necesarios para la mecánica del juego

- Obtener la jornada seleccionada
- Cargar jugadores con sus campos reales:
  - `name`
  - `image` (URL Blob)
  - `ranking`
- Asegurar orden correcto por ranking (sincronizado con el dashboard)

### 5. Reescribir el estado inicial del juego

- En vez de generar una lista manual, usar:

```ts
const players = await prisma.player.findMany({
  where: { matchdayId },
  orderBy: { ranking: 'asc' },
})
```

### 6. Mantener la lógica del juego en memoria

- No guardar nada en la BD
- No modificar las tablas Competition, Matchday o Player
- Solo lectura + mecánica de duelos en frontend o server actions de lectura

### 7. Validar campos requeridos según el modelo

- Todos los jugadores deben tener:
  - `imageUploaded = true`
  - `image` válido
  - nombre no vacío

### 8. Asegurar sincronización total con el dashboard

- Toda la estructura de datos viene del mismo origen Neon
- Las imágenes provienen del mismo Vercel Blob
- Las relaciones Competition → Matchday → Player se respetan

---

## CRITERIOS DE CALIDAD

Tu solución debe cumplir:

1. **No inventar modelos ni endpoints nuevos**  
   Todo debe derivarse del modelo ya documentado.

2. **No escribir en la base de datos**  
   Solo usar Prisma en modo lectura.

3. **Código limpio y seguro**  
   Patrones equivalentes al dashboard:
   - Prisma Singleton
   - Queries tipadas
   - Server Components o Server Actions para obtener datos

4. **Sincronización 1:1 con dashboard**  
   Si una imagen, nombre o ranking cambia en el dashboard, MatchUp Arena debe reflejarlo automáticamente.

---

## OUTPUT ESPERADO DE CLAUDE

Debes generar:

1. **Listado completo de archivos a modificar** en MatchUp Arena.
2. **Código actualizado**, listo para copiar/pegar:
   - prisma.ts
   - loaders / server actions
   - componentes que consumen datos
3. **Query exacta para obtener los jugadores en orden correcto**
4. **Eliminación documentada de código obsoleto**
5. **Resumen final de cómo MatchUp Arena queda conectado al dashboard mediante BD real**

---

## VERIFICACIÓN

Antes de entregar el resultado, revisa:

- [ ] Prisma está correctamente configurado sin migraciones
- [ ] Todas las consultas respetan el modelo Competition → Matchday → Player
- [ ] No hay escritura accidental en BD
- [ ] Las imágenes se consumen desde el campo `image`
- [ ] La app funciona si el dashboard cambia datos
- [ ] No se usan datos locales en ningún punto

Cuando todo esté validado, entrega el resultado final.
