import assert from "node:assert/strict"
import { beforeEach, describe, it } from "node:test"
import type { Especialidad } from "../src/models/Especialidad.ts"
import { EspecialidadService } from "../src/services/EspecialidadService.ts"

class FakeEspecialidadRepository {
  items: Especialidad[] = []

  async findAll() { return [...this.items] }
  async findOne(id: string) { return this.items.find((item) => item.id === id) }
  async findByName(nombre: string) {
    return this.items.find((item) => item.nombre.toLowerCase() === nombre.toLowerCase())
  }
  async findOtherByName(nombre: string, excludeId: string) {
    return this.items.find(
      (item) => item.nombre.toLowerCase() === nombre.toLowerCase() && item.id !== excludeId
    )
  }
  async create(item: Especialidad) { this.items.push(item); return item }
  async update(id: string, patch: Partial<Especialidad>) {
    const found = this.items.find((item) => item.id === id)
    if (!found) return undefined
    Object.assign(found, patch)
    return found
  }
  async delete(id: string) {
    this.items = this.items.filter((item) => item.id !== id)
    return { id }
  }
}

describe("EspecialidadService", () => {
  let repo: FakeEspecialidadRepository
  let service: EspecialidadService

  beforeEach(() => {
    repo = new FakeEspecialidadRepository()
    service = new EspecialidadService(repo)
  })

  it("crea una especialidad y limpia los espacios", async () => {
    const creada = await service.create({ nombre: "  Cardiología  " })
    assert.equal(creada.nombre, "Cardiología")
    assert.equal(repo.items.length, 1)
  })

  it("rechaza un nombre repetido sin importar mayúsculas", async () => {
    await service.create({ nombre: "Cardiología" })
    await assert.rejects(
      () => service.create({ nombre: "cardiología" }),
      /Ya existe una especialidad/
    )
  })

  it("rechaza un nombre vacío", async () => {
    await assert.rejects(() => service.create({ nombre: "   " }), /obligatorio/)
  })

  describe("update", () => {
    it("rechaza un nombre que ya tiene OTRA especialidad", async () => {
      await service.create({ nombre: "Cardiología" })
      const pediatria = await service.create({ nombre: "Pediatría" })

      await assert.rejects(
        () => service.update(pediatria.id, { nombre: "cardiología" }),
        /Ya existe otra especialidad/
      )
    })

    it("permite guardar una especialidad con su propio nombre", async () => {
      const cardio = await service.create({ nombre: "Cardiología" })

      const actualizada = await service.update(cardio.id, {
        nombre: "Cardiología",
        descripcion: "Corazón y circulación",
      })

      assert.equal(actualizada?.descripcion, "Corazón y circulación")
    })

    it("rechaza actualizar una especialidad que no existe", async () => {
      await assert.rejects(
        () => service.update("id-inexistente", { nombre: "Neurología" }),
        /no existe/
      )
    })
  })

  describe("remove", () => {
    it("borra una especialidad existente", async () => {
      const cardio = await service.create({ nombre: "Cardiología" })

      await service.remove(cardio.id)

      assert.equal(repo.items.length, 0)
    })

    it("rechaza borrar una especialidad que no existe", async () => {
      await assert.rejects(() => service.remove("id-inexistente"), /no existe/)
    })
  })
})