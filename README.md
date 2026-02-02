# Backend SNAI

Backend en NestJS con autenticación JWT, perfiles y permisos a nivel de endpoint.

## Requisitos

- Node 20+
- PostgreSQL
- Variables de entorno (`.env`):
  - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL` (opcional)
  - `JWT_SECRET` (obligatorio)
  - `PORT` (opcional, por defecto 3000)

## Instalación

```bash
npm install
```

## Correr

```bash
npm run start:dev    # modo watch
# o
npm run start        # sin watch
```

Swagger: `/api`

## Tests

```bash
npm run test         # unit
npm run test:e2e     # e2e (usa la DB del .env.prd)
# Ejemplo para correr solo el flujo de perfil:
npm run test:e2e -- --runTestsByPath test/perfil-flow.e2e-spec.ts
```

## Sistema de permisos

- **Modelo**:
  - `Usuario` → puede tener varias `Sesion` (usuario-perfil).
  - `Perfil` → agrupa permisos.
  - `Endpoint` → ruta lógica (ej. `/usuario`, `/perfil`, `/localidades`).
  - `Permiso` → une `Perfil` con `Endpoint` e indica `VIEW` y/o `EDIT`.
- **Guardia**: `PermisosGuard`
  - Normaliza la ruta (`/usuario`, `/usuario/:id`, etc.) y verifica en DB si el usuario tiene permiso para el método HTTP:
    - `VIEW` se usa para `GET`.
    - `EDIT` se usa para `POST`, `PUT`, `PATCH`, `DELETE`.
  - Respeta decorador `@Public()` para saltar permisos.
- **Flujo típico**:
  1) Registrar usuario (`POST /auth/register`) → devuelve JWT.
  2) Crear endpoints en DB (tabla `endpoint`).
  3) Crear perfil con permisos (`POST /perfil`) indicando `{ endpoint, VIEW, EDIT }`.
  4) Asociar usuario a perfil creando una `Sesion` (p.ej. en el flujo e2e se hace directamente con repositorio).
  5) Consumir rutas protegidas con `Authorization: Bearer <token>`.

## Notas del flujo e2e

- `test/perfil-flow.e2e-spec.ts` limpia tablas (`permiso`, `session`, `endpoint`, `perfil`, `usuario`), registra usuario, crea endpoints, crea perfil con permisos y verifica acceso a `/usuario`.
- Usa la misma DB definida en `.env`. Asegúrate de que sea una base de pruebas antes de correrlo porque borra datos de esos modelos.
