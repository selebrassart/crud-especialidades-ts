import { boolean, pgTable, text } from "drizzle-orm/pg-core"

export const especialidadTable = pgTable("especialidades", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull().default(""),
  activa: boolean("activa").notNull().default(true),
})

export type Especialidad = typeof especialidadTable.$inferSelect
export type EspecialidadInput = { nombre: string; descripcion?: string }