import { and, asc, eq, ne, sql } from "drizzle-orm"
import { db } from "../db.ts"
import { especialidadTable, type Especialidad } from "../models/Especialidad.ts"

export class EspecialidadRepository {
  async findAll(): Promise<Especialidad[]> {
    return db.select().from(especialidadTable).orderBy(asc(especialidadTable.nombre))
  }

  async findOne(id: string): Promise<Especialidad | undefined> {
    const [row] = await db
      .select()
      .from(especialidadTable)
      .where(eq(especialidadTable.id, id))
      .limit(1)
    return row
  }

  async findByName(nombre: string): Promise<Especialidad | undefined> {
    const [row] = await db
      .select()
      .from(especialidadTable)
      .where(sql`lower(${especialidadTable.nombre}) = lower(${nombre})`)
      .limit(1)
    return row
  }

  async findOtherByName(nombre: string, excludeId: string): Promise<Especialidad | undefined> {
    const [row] = await db
      .select()
      .from(especialidadTable)
      .where(
        and(
          sql`lower(${especialidadTable.nombre}) = lower(${nombre})`,
          ne(especialidadTable.id, excludeId)
        )
      )
      .limit(1)
    return row
  }

  async create(item: Especialidad): Promise<Especialidad> {
    await db.insert(especialidadTable).values(item)
    return item
  }

  async update(id: string, patch: Partial<Especialidad>): Promise<Especialidad | undefined> {
    await db.update(especialidadTable).set(patch).where(eq(especialidadTable.id, id))
    return this.findOne(id)
  }

  async delete(id: string): Promise<{ id: string }> {
    await db.delete(especialidadTable).where(eq(especialidadTable.id, id))
    return { id }
  }
}