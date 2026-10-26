CREATE TABLE IF NOT EXISTS especialidades (
  id          text PRIMARY KEY,
  nombre      text NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  activa      boolean NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS especialidades_nombre_unique
  ON especialidades (lower(nombre));

  CREATE TABLE IF NOT EXISTS medicos (
  id               text PRIMARY KEY,
  nombre           text NOT NULL,
  especialidad_id  text NOT NULL REFERENCES especialidades(id) ON DELETE RESTRICT
);