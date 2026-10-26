import assert from "node:assert/strict"
import { beforeEach, describe, it } from "node:test"
import type { Especialidad } from "../src/models/Especialidad.ts"
import { EspecialidadService } from "../src/services/EspecialidadService.ts"
import type { Medico } from "../src/models/Medico.ts"

class FakeMedicoRepository {
  items: Medico[] = []

  async countByEspecialidad(especialidadId: string) {
    return this.items.filter((item) => item.especialidadId === especialidadId).length
  }

  async create(item: Medico) {
    this.items.push(item)
    return item
  }
}
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
  let medicoRepo: FakeMedicoRepository

  beforeEach(() => {
    repo = new FakeEspecialidadRepository()
     medicoRepo = new FakeMedicoRepository()
    service = new EspecialidadService(repo, medicoRepo)
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

    it("rechaza borrar una especialidad que tiene médicos", async () => {
  const cardio = await service.create({ nombre: "Cardiología" })
  await medicoRepo.create({ id: "m1", nombre: "Dra. Gómez", especialidadId: cardio.id })

  await assert.rejects(() => service.remove(cardio.id), /médicos asignados/)

  assert.equal(repo.items.length, 1)   // no se borró
})

it("no se bloquea por médicos de OTRA especialidad", async () => {
  const cardio = await service.create({ nombre: "Cardiología" })
  const pediatria = await service.create({ nombre: "Pediatría" })
  await medicoRepo.create({ id: "m1", nombre: "Dra. Gómez", especialidadId: cardio.id })

  await service.remove(pediatria.id)

  assert.equal(repo.items.length, 1)              // quedó una sola especialidad
  assert.equal(repo.items[0].id, cardio.id)       // y es Cardiología
})
it("permite borrar cuando ya no tiene médicos", async () => {
  const cardio = await service.create({ nombre: "Cardiología" })
  await medicoRepo.create({ id: "m1", nombre: "Dra. Gómez", especialidadId: cardio.id })

  await assert.rejects(() => service.remove(cardio.id), /médicos asignados/)

  medicoRepo.items = []        // "vaciar" la lista = el médico ya no existe

  await service.remove(cardio.id)
  assert.equal(repo.items.length, 0)
})
  })
})


