import pg from "pg"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("Falta DATABASE_URL en el archivo .env")
}

export const pool = new pg.Pool({ connectionString })

import { drizzle } from "drizzle-orm/node-postgres"
export const db = drizzle({ client: pool })