import express from "express"
import { especialidadService } from "./services/container.ts"
import { sanitizeEspecialidadInput } from "./validations/EspecialidadValidation.ts"

const app = express()
app.use(express.json())

function mensaje(error: unknown): string {
  return error instanceof Error ? error.message : "Error inesperado"
}

app.get("/especialidades", async (_req, res) => {
  try {
    res.json(await especialidadService.findAll())
  } catch (error) {
    res.status(500).json({ error: mensaje(error) })
  }
})

app.get("/especialidades/:id", async (req, res) => {
  try {
    const item = await especialidadService.findOne(req.params.id)
    if (!item) {
      res.status(404).json({ error: "La especialidad no existe" })
      return
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: mensaje(error) })
  }
})

app.post("/especialidades", async (req, res) => {  //req es lo q llega, ruta parametros y cuerpo. res es lo q respondo
  try {
    const input = sanitizeEspecialidadInput(req.body)
    const creada = await especialidadService.create(input)
    res.status(201).json(creada)
  } catch (error) {
    res.status(400).json({ error: mensaje(error) })
  }
})


app.put("/especialidades/:id", async (req, res) => {
  try {
    const existente = await especialidadService.findOne(req.params.id)
    if (!existente) {
      res.status(404).json({ error: "La especialidad no existe" })
      return
    }

    const input = sanitizeEspecialidadInput(req.body)
    const actualizada = await especialidadService.update(req.params.id, input)
    res.json(actualizada)
  } catch (error) {
    res.status(400).json({ error: mensaje(error) })
  }
})


app.delete("/especialidades/:id", async (req, res) => {
  try {
    const existente = await especialidadService.findOne(req.params.id)
    if (!existente) {
      res.status(404).json({ error: "La especialidad no existe" })
      return
    }

    const resultado = await especialidadService.remove(req.params.id)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: mensaje(error) })
  }
})

app.listen(3001, () => console.log("API en http://localhost:3001"))