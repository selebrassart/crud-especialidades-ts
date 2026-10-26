import { eq, sql } from "drizzle-orm"
import { db } from "../db.ts"
import { medicoTable, type Medico } from "../models/Medico.ts"

export class MedicoRepository {
  async countByEspecialidad(especialidadId: string): Promise<number> {
    const [row] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(medicoTable)
      .where(eq(medicoTable.especialidadId, especialidadId))
    return row?.total ?? 0
  }

  async create(item: Medico): Promise<Medico> {
    await db.insert(medicoTable).values(item)
    return item
  }
}