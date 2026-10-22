# CRUD de especialidades

Proyecto de práctica: CRUD de especialidades médicas con arquitectura en capas
(repository → service), PostgreSQL, Drizzle ORM y tests unitarios.
Armado como ejercicio de aprendizaje, siguiendo la arquitectura de un sistema de turnos médicos hecho para la cátedra Desarrollo de Software.
## Stack
Node.js, TypeScript, PostgreSQL, Drizzle ORM, `node:test`.

## Cómo correrlo
1. `npm install`
2. Crear una base `crud_demo` y un archivo `.env` (ver `.env.example`)
3. `npm run setup` (crea la tabla)
4. `npm run start -- listar`
5. `npm test`

## Estructura
- `src/models`: tabla y tipos
- `src/repository`: acceso a la base
- `src/services`: reglas de negocio
- `src/services/container.ts`: arma las dependencias
- `test/`: tests del service con un repositorio en memoria
