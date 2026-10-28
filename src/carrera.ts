import { especialidadService } from "./services/container.ts"
import { pool } from "./db.ts"

const resultados = await Promise.allSettled([
  especialidadService.create({ nombre: "Dermatología" }),
  especialidadService.create({ nombre: "Dermatología" }),
])

for (const r of resultados) {
  if (r.status === "fulfilled") {
    console.log("OK:", r.value)
  } else {
    console.log("RECHAZADA:", r.reason?.cause?.message ?? r.reason?.message ?? r.reason)
  }
}

await pool.end()