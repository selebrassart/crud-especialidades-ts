import { pgTable, text } from "drizzle-orm/pg-core"

export const medicoTable = pgTable("medicos", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  especialidadId: text("especialidad_id").notNull(),
})

export type Medico = typeof medicoTable.$inferSelect