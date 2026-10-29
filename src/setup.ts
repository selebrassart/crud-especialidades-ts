import { readFileSync } from "node:fs"
import { pool } from "./db.ts"

try {
  const sql = readFileSync("sql/schema.sql", "utf8")
  await pool.query(sql)
  console.log("Esquema aplicado")
} catch (error) {
  console.error("Error al aplicar el esquema:", error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await pool.end()
}