# Análisis Técnico Completo: matchup-arena-dashboard

> **Generado:** 2025-12-05  
> **Repositorio:** matchup-arena-dashboard  
> **Branch:** fixes/blog-error

---

## 1) RESUMEN EJECUTIVO

El proyecto `matchup-arena-dashboard` es una aplicación **Next.js 16** con **App Router** que gestiona competiciones deportivas, jornadas (matchdays) y jugadores. Utiliza **Prisma ORM 5.22** conectado a **PostgreSQL (Neon)** mediante URLs duales (`DATABASE_URL` + `DIRECT_URL`). La arquitectura sigue un patrón de **Server Actions** para operaciones CRUD combinado con **API Routes** para endpoints específicos (autenticación, upload de imágenes a Vercel Blob, publicación). La autenticación es simple, basada en contraseña única y cookies de sesión. El estado del dashboard se gestiona mediante un Context de React que consume Server Actions directamente. El modelo de datos es sencillo: 3 entidades con relaciones 1:N en cascada (`Competition → Matchday → Player`).

---

## 2) DOCUMENTO TÉCNICO DETALLADO

### 2.1 Análisis del Schema Prisma

#### 2.1.1 Configuración del Datasource

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Pooled connection (para Neon)
  directUrl = env("DIRECT_URL")         // Direct connection (para migraciones)
}
```

**Notas:**

- Usa el patrón dual de URLs recomendado por Neon para separar conexiones pooled (runtime) de directas (migraciones).
- El cliente se genera con `prisma-client-js`.

#### 2.1.2 Modelos

| Modelo        | Tabla SQL      | Campos                                                                    | Claves                    | Índices                           |
| ------------- | -------------- | ------------------------------------------------------------------------- | ------------------------- | --------------------------------- |
| `Competition` | `competitions` | id, name, slug, createdAt, updatedAt                                      | PK: id                    | UNIQUE: slug                      |
| `Matchday`    | `matchdays`    | id, matchday, status, createdAt, updatedAt, competitionId                 | PK: id, FK: competitionId | UNIQUE: (competitionId, matchday) |
| `Player`      | `players`      | id, name, image, imageUploaded, ranking, createdAt, updatedAt, matchdayId | PK: id, FK: matchdayId    | UNIQUE: (matchdayId, ranking)     |

#### 2.1.3 Detalle de Campos por Modelo

**Competition:**
| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | String | No | cuid() | Identificador único |
| name | String | No | - | Nombre de la competición |
| slug | String | No | - | Slug único para rutas |
| createdAt | DateTime | No | now() | Fecha de creación |
| updatedAt | DateTime | No | @updatedAt | Última modificación |

**Matchday:**
| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | String | No | cuid() | Identificador único |
| matchday | Int | No | - | Número de jornada |
| status | String | No | "draft" | Estado: draft/ready/published |
| createdAt | DateTime | No | now() | Fecha de creación |
| updatedAt | DateTime | No | @updatedAt | Última modificación |
| competitionId | String | No | - | FK a Competition |

**Player:**
| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | String | No | cuid() | Identificador único |
| name | String | No | - | Nombre del jugador |
| image | String | No | - | URL de imagen en Blob |
| imageUploaded | Boolean | No | false | Si la imagen está subida |
| ranking | Int | No | - | Posición/ranking |
| createdAt | DateTime | No | now() | Fecha de creación |
| updatedAt | DateTime | No | @updatedAt | Última modificación |
| matchdayId | String | No | - | FK a Matchday |

#### 2.1.4 Relaciones

| Origen      | Destino  | Cardinalidad | onDelete | Descripción                           |
| ----------- | -------- | ------------ | -------- | ------------------------------------- |
| Competition | Matchday | 1:N          | CASCADE  | Una competición tiene muchas jornadas |
| Matchday    | Player   | 1:N          | CASCADE  | Una jornada tiene muchos jugadores    |

#### 2.1.5 Constraints

1. **competitions_slug_key**: slug único por competición
2. **matchdays_competitionId_matchday_key**: combinación única de competición + número de jornada
3. **players_matchdayId_ranking_key**: combinación única de jornada + ranking (no puede haber dos jugadores con mismo ranking en una jornada)

---

### 2.2 Arquitectura Backend

#### 2.2.1 Estructura de Carpetas Relevante

```
/app
├── api/
│   ├── auth/
│   │   ├── login/route.ts      # POST: Login con contraseña
│   │   └── logout/route.ts     # POST: Logout
│   ├── blob/
│   │   └── files/route.ts      # GET: Listar blobs, DELETE: Eliminar blob
│   ├── publish/route.ts        # POST: Publicar matchday
│   ├── state/route.ts          # GET: Obtener estado del dashboard
│   └── upload/
│       └── image/route.ts      # POST: Subir imagen de jugador
├── dashboard/                   # Rutas protegidas del dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   ├── competitions/
│   ├── matchdays/
│   ├── players/
│   └── files/
└── login/page.tsx              # Página de login

/lib
├── prisma.ts                   # Singleton de Prisma Client
├── actions.ts                  # Server Actions (CRUD)
├── auth.ts                     # Funciones de autenticación
├── types.ts                    # Definiciones de tipos
└── validators.ts               # Utilidades de validación

/contexts
└── DashboardContext.tsx        # Context global del dashboard

/middleware.ts                  # Middleware de autenticación
```

#### 2.2.2 Instanciación de Prisma Client

```typescript
// lib/prisma.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Patrón:** Singleton con caché en `globalThis` para evitar múltiples instancias en desarrollo (hot reload).

#### 2.2.3 Patrones Empleados

| Patrón               | Uso                                            | Ubicación                        |
| -------------------- | ---------------------------------------------- | -------------------------------- |
| **Server Actions**   | CRUD principal de entidades                    | `/lib/actions.ts`                |
| **API Routes**       | Operaciones especiales (auth, upload, publish) | `/app/api/**`                    |
| **Singleton**        | Instancia única de Prisma                      | `/lib/prisma.ts`                 |
| **Context Provider** | Estado global del dashboard                    | `/contexts/DashboardContext.tsx` |
| **Middleware**       | Protección de rutas                            | `/middleware.ts`                 |

#### 2.2.4 Gestión de Conexión a Neon

- **DATABASE_URL**: Conexión pooled para queries en runtime
- **DIRECT_URL**: Conexión directa para migraciones de Prisma
- **Configuración en Prisma**: Usa `directUrl` para operaciones de schema

---

### 2.3 API Endpoints

| Método | Ruta                | Descripción          | Body/Params                                           | Respuesta                              |
| ------ | ------------------- | -------------------- | ----------------------------------------------------- | -------------------------------------- |
| POST   | `/api/auth/login`   | Autenticación        | `{ password: string }`                                | `{ success: boolean }`                 |
| POST   | `/api/auth/logout`  | Cerrar sesión        | -                                                     | `{ success: boolean }`                 |
| GET    | `/api/blob/files`   | Listar imágenes      | `?prefix=images/`                                     | `{ success, data: File[] }`            |
| DELETE | `/api/blob/files`   | Eliminar imagen      | `{ url: string }`                                     | `{ success: boolean }`                 |
| POST   | `/api/publish`      | Publicar matchday    | `{ matchdayId: string }`                              | `{ success, error? }`                  |
| GET    | `/api/state`        | Estado del dashboard | -                                                     | `{ success, data: DashboardState }`    |
| POST   | `/api/upload/image` | Subir imagen         | FormData: file, competitionSlug, matchday, playerName | `{ success, data: { url, pathname } }` |

---

### 2.4 Server Actions

| Función                       | Descripción                                             | Revalidación                                               |
| ----------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| `getCompetitions()`           | Obtener todas las competiciones con matchdays y players | -                                                          |
| `getCompetition(id)`          | Obtener una competición por ID                          | -                                                          |
| `createCompetition(data)`     | Crear competición                                       | `/dashboard/competitions`                                  |
| `updateCompetition(id, data)` | Actualizar competición                                  | `/dashboard/competitions`, `/dashboard/competitions/${id}` |
| `deleteCompetition(id)`       | Eliminar competición                                    | `/dashboard/competitions`                                  |
| `getMatchdays()`              | Obtener todas las jornadas                              | -                                                          |
| `getMatchday(id)`             | Obtener una jornada por ID                              | -                                                          |
| `createMatchday(data)`        | Crear jornada                                           | `/dashboard/matchdays`                                     |
| `updateMatchday(id, data)`    | Actualizar jornada                                      | `/dashboard/matchdays`, `/dashboard/matchdays/${id}`       |
| `deleteMatchday(id)`          | Eliminar jornada                                        | `/dashboard/matchdays`                                     |
| `getPlayers(matchdayId)`      | Obtener jugadores de una jornada                        | -                                                          |
| `createPlayer(data)`          | Crear jugador                                           | `/dashboard/matchdays/${matchdayId}`, `/dashboard/players` |
| `updatePlayer(id, data)`      | Actualizar jugador                                      | `/dashboard/matchdays/${matchdayId}`, `/dashboard/players` |
| `deletePlayer(id)`            | Eliminar jugador                                        | `/dashboard/matchdays/${matchdayId}`, `/dashboard/players` |
| `publishMatchday(matchdayId)` | Publicar jornada (validaciones)                         | `/dashboard/matchdays`, `/dashboard/matchdays/${id}`       |
| `getDashboardState()`         | Estado completo para el Context                         | -                                                          |

---

### 2.5 Flujos de Datos

#### Flujo de Publicación de Matchday

```
1. Cliente llama POST /api/publish { matchdayId }
2. API Route invoca publishMatchday(matchdayId) de actions.ts
3. Validaciones:
   - ¿Existe el matchday?
   - ¿Tiene al menos un jugador?
   - ¿Todos los jugadores tienen imagen subida?
   - ¿Todos los jugadores tienen nombre?
   - ¿Rankings únicos?
4. Si pasa validaciones → actualiza status a "published"
5. Revalida rutas del dashboard
```

#### Flujo de Upload de Imagen

```
1. Cliente envía FormData a POST /api/upload/image
2. Validaciones: tipo (jpeg/png/webp/gif), tamaño (<5MB)
3. Genera pathname: images/{competitionSlug}/{matchday}/{playerName}.{ext}
4. Sube a Vercel Blob con addRandomSuffix: true
5. Retorna URL pública del blob
```

#### Flujo de Autenticación

```
1. Middleware intercepta todas las requests
2. Rutas públicas (/login, /api/auth/*) → pasan
3. Otras rutas → verifica cookie "matchup-dashboard-auth"
4. Sin cookie → redirect a /login
5. Login: verifica password vs DASHBOARD_PASSWORD env
6. Si válido → crea cookie de sesión (7 días)
```

---

### 2.6 Dependencias Críticas

| Paquete        | Versión | Uso                        |
| -------------- | ------- | -------------------------- |
| next           | 16.0.7  | Framework principal        |
| @prisma/client | 5.22.0  | ORM cliente                |
| prisma         | 5.22.0  | CLI y migraciones          |
| @vercel/blob   | ^2.0.0  | Almacenamiento de imágenes |
| react          | 19.2.0  | UI                         |

**Variables de entorno requeridas:**

- `DATABASE_URL` - URL pooled de Neon
- `DIRECT_URL` - URL directa de Neon
- `DASHBOARD_PASSWORD` - Contraseña del dashboard
- `BLOB_READ_WRITE_TOKEN` - Token para Vercel Blob (implícito)

---

### 2.7 Observaciones Técnicas

#### Aspectos Positivos

1. ✅ Patrón de Prisma singleton correcto
2. ✅ Uso de Server Actions para operaciones de datos
3. ✅ Validaciones antes de publicar
4. ✅ Cascade delete bien configurado
5. ✅ Constraints de unicidad apropiados
6. ✅ Revalidación de rutas después de mutaciones

#### Áreas de Mejora Identificadas

1. **Autenticación básica**: La autenticación con contraseña única y sin verificación de token es vulnerable. Considerar implementar JWT o sesiones verificables.

2. **Sin manejo de errores centralizado**: Cada endpoint maneja errores individualmente. Podría beneficiarse de un wrapper de error handling.

3. **Tipado parcial en actions.ts**: Algunos tipos se definen inline (`CompetitionRecord`, `PlayerRecord`). Mejor centralizarlos en `types.ts`.

4. **Sin rate limiting**: Los endpoints de API no tienen protección contra abuso.

5. **Upload sin verificación de auth**: El endpoint `/api/upload/image` no verifica autenticación explícitamente (solo depende del middleware).

6. **Sin transacciones**: Operaciones compuestas (como publicar) podrían beneficiarse de transacciones Prisma.

7. **Estado en Context**: El `DashboardContext` refetch completo en cada mutación. Podría optimizarse con actualizaciones parciales.

---

## 3) CONTEXTO ESTRUCTURADO FINAL (JSON)

```json
{
  "projectInfo": {
    "name": "matchup-arena-dashboard",
    "framework": "Next.js 16.0.7",
    "orm": "Prisma 5.22.0",
    "database": "PostgreSQL (Neon)",
    "language": "TypeScript",
    "node": "^20"
  },
  "prismaModel": {
    "generator": "prisma-client-js",
    "datasource": {
      "provider": "postgresql",
      "urlEnv": "DATABASE_URL",
      "directUrlEnv": "DIRECT_URL"
    }
  },
  "entities": [
    {
      "name": "Competition",
      "tableName": "competitions",
      "fields": [
        { "name": "id", "type": "String", "attributes": ["@id", "@default(cuid())"] },
        { "name": "name", "type": "String", "attributes": [] },
        { "name": "slug", "type": "String", "attributes": ["@unique"] },
        { "name": "createdAt", "type": "DateTime", "attributes": ["@default(now())"] },
        { "name": "updatedAt", "type": "DateTime", "attributes": ["@updatedAt"] },
        { "name": "matchdays", "type": "Matchday[]", "relation": true }
      ],
      "indexes": ["slug (UNIQUE)"]
    },
    {
      "name": "Matchday",
      "tableName": "matchdays",
      "fields": [
        { "name": "id", "type": "String", "attributes": ["@id", "@default(cuid())"] },
        { "name": "matchday", "type": "Int", "attributes": [] },
        {
          "name": "status",
          "type": "String",
          "attributes": ["@default(\"draft\")"],
          "validValues": ["draft", "ready", "published"]
        },
        { "name": "createdAt", "type": "DateTime", "attributes": ["@default(now())"] },
        { "name": "updatedAt", "type": "DateTime", "attributes": ["@updatedAt"] },
        { "name": "competition", "type": "Competition", "relation": true },
        { "name": "competitionId", "type": "String", "foreignKey": true },
        { "name": "players", "type": "Player[]", "relation": true }
      ],
      "indexes": ["(competitionId, matchday) (UNIQUE)"]
    },
    {
      "name": "Player",
      "tableName": "players",
      "fields": [
        { "name": "id", "type": "String", "attributes": ["@id", "@default(cuid())"] },
        { "name": "name", "type": "String", "attributes": [] },
        {
          "name": "image",
          "type": "String",
          "attributes": [],
          "description": "URL de imagen en Vercel Blob"
        },
        { "name": "imageUploaded", "type": "Boolean", "attributes": ["@default(false)"] },
        { "name": "ranking", "type": "Int", "attributes": [] },
        { "name": "createdAt", "type": "DateTime", "attributes": ["@default(now())"] },
        { "name": "updatedAt", "type": "DateTime", "attributes": ["@updatedAt"] },
        { "name": "matchday", "type": "Matchday", "relation": true },
        { "name": "matchdayId", "type": "String", "foreignKey": true }
      ],
      "indexes": ["(matchdayId, ranking) (UNIQUE)"]
    }
  ],
  "relations": [
    {
      "from": "Competition",
      "to": "Matchday",
      "type": "1:N",
      "foreignKey": "competitionId",
      "onDelete": "CASCADE"
    },
    {
      "from": "Matchday",
      "to": "Player",
      "type": "1:N",
      "foreignKey": "matchdayId",
      "onDelete": "CASCADE"
    }
  ],
  "backendArchitecture": {
    "pattern": "Server Actions + API Routes",
    "prismaLocation": "/lib/prisma.ts",
    "actionsLocation": "/lib/actions.ts",
    "authLocation": "/lib/auth.ts",
    "middlewareLocation": "/middleware.ts",
    "contextLocation": "/contexts/DashboardContext.tsx"
  },
  "apiEndpoints": [
    {
      "method": "POST",
      "path": "/api/auth/login",
      "description": "Autenticación con contraseña",
      "handler": "verifyPassword + createSession"
    },
    {
      "method": "POST",
      "path": "/api/auth/logout",
      "description": "Cerrar sesión",
      "handler": "destroySession"
    },
    {
      "method": "GET",
      "path": "/api/blob/files",
      "description": "Listar archivos en Blob",
      "handler": "@vercel/blob list"
    },
    {
      "method": "DELETE",
      "path": "/api/blob/files",
      "description": "Eliminar archivo de Blob",
      "handler": "@vercel/blob del"
    },
    {
      "method": "POST",
      "path": "/api/publish",
      "description": "Publicar matchday",
      "handler": "publishMatchday action"
    },
    {
      "method": "GET",
      "path": "/api/state",
      "description": "Obtener estado del dashboard",
      "handler": "getDashboardState action"
    },
    {
      "method": "POST",
      "path": "/api/upload/image",
      "description": "Subir imagen de jugador",
      "handler": "@vercel/blob put"
    }
  ],
  "serverActions": [
    "getCompetitions",
    "getCompetition",
    "createCompetition",
    "updateCompetition",
    "deleteCompetition",
    "getMatchdays",
    "getMatchday",
    "createMatchday",
    "updateMatchday",
    "deleteMatchday",
    "getPlayers",
    "createPlayer",
    "updatePlayer",
    "deletePlayer",
    "publishMatchday",
    "getDashboardState"
  ],
  "dataFlows": [
    {
      "name": "PublishMatchday",
      "steps": [
        "POST /api/publish",
        "Validate matchday exists",
        "Validate has players",
        "Validate all images uploaded",
        "Validate all names present",
        "Validate unique rankings",
        "Update status to published",
        "Revalidate dashboard routes"
      ]
    },
    {
      "name": "UploadImage",
      "steps": [
        "POST /api/upload/image with FormData",
        "Validate file type (jpeg/png/webp/gif)",
        "Validate file size (<5MB)",
        "Generate pathname: images/{slug}/{matchday}/{name}.{ext}",
        "Upload to Vercel Blob",
        "Return public URL"
      ]
    },
    {
      "name": "Authentication",
      "steps": [
        "Middleware intercepts request",
        "Check if public route",
        "Verify auth cookie",
        "Redirect to /login if missing",
        "Login verifies password vs env",
        "Create session cookie (7 days)"
      ]
    }
  ],
  "notableRules": [
    {
      "rule": "Matchday cannot be published without players",
      "location": "lib/actions.ts:publishMatchday"
    },
    {
      "rule": "All players must have uploaded images to publish",
      "location": "lib/actions.ts:publishMatchday"
    },
    {
      "rule": "Player rankings must be unique within a matchday",
      "location": "prisma/schema.prisma + lib/actions.ts"
    },
    {
      "rule": "Competition slug must be unique",
      "location": "prisma/schema.prisma"
    },
    {
      "rule": "Matchday number must be unique per competition",
      "location": "prisma/schema.prisma"
    },
    {
      "rule": "Cascade delete: Competition -> Matchdays -> Players",
      "location": "prisma/schema.prisma"
    },
    {
      "rule": "Image path format: images/{competitionSlug}/{matchday}/{playerName}.{ext}",
      "location": "app/api/upload/image/route.ts"
    }
  ],
  "dependencies": {
    "runtime": {
      "next": "16.0.7",
      "@prisma/client": "5.22.0",
      "@vercel/blob": "^2.0.0",
      "react": "19.2.0",
      "react-dom": "19.2.0"
    },
    "dev": {
      "prisma": "5.22.0",
      "typescript": "^5",
      "tailwindcss": "^4",
      "eslint": "^9"
    }
  },
  "environmentVariables": [
    {
      "name": "DATABASE_URL",
      "description": "Neon pooled connection URL",
      "required": true
    },
    {
      "name": "DIRECT_URL",
      "description": "Neon direct connection URL for migrations",
      "required": true
    },
    {
      "name": "DASHBOARD_PASSWORD",
      "description": "Password for dashboard authentication",
      "required": true
    },
    {
      "name": "BLOB_READ_WRITE_TOKEN",
      "description": "Vercel Blob storage token",
      "required": true,
      "implicit": true
    }
  ],
  "recommendations": [
    {
      "area": "Security",
      "issue": "Simple password authentication without token verification",
      "suggestion": "Implement JWT or session verification against database"
    },
    {
      "area": "Error Handling",
      "issue": "No centralized error handling",
      "suggestion": "Create error wrapper for API routes and actions"
    },
    {
      "area": "Performance",
      "issue": "Full state refetch on every mutation in Context",
      "suggestion": "Implement optimistic updates or partial state updates"
    },
    {
      "area": "Security",
      "issue": "No rate limiting on API endpoints",
      "suggestion": "Add rate limiting middleware"
    },
    {
      "area": "Data Integrity",
      "issue": "No transactions for compound operations",
      "suggestion": "Use Prisma transactions for publishMatchday"
    }
  ]
}
```

---

## VERIFICACIÓN FINAL

- [x] Todos los modelos de Prisma documentados (Competition, Matchday, Player)
- [x] Todos los archivos backend relevantes analizados
- [x] JSON final válido y parseable
- [x] No se ha introducido información inventada - todo proviene del código
