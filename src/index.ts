import { pool } from "./db.ts"
import { especialidadService } from "./services/container.ts"

const [comando, ...args] = process.argv.slice(2)

try {
  switch (comando) {
    case "crear": {
      const [nombre, descripcion] = args
      console.log(await especialidadService.create({ nombre, descripcion }))
      break
    }
    case "listar":
      console.table(await especialidadService.findAll())
      break
    case "ver":
      console.log(await especialidadService.findOne(args[0]))
      break
    case "editar": {
      const [id, nombre, descripcion] = args
      console.log(await especialidadService.update(id, { nombre, descripcion }))
      break
    }
    case "borrar":
      console.log(await especialidadService.remove(args[0]))
      break
    default:
      console.log(
        "Comandos: crear <nombre> [desc] | listar | ver <id> | editar <id> <nombre> <desc> | borrar <id>"
      )
  }
} catch (error) {
  console.error("Error:", error instanceof Error ? error.message : error)
} finally {
  await pool.end()
}