import type { Especialidad, EspecialidadInput } from "../models/Especialidad.ts"
import type { EspecialidadRepository } from "../repository/EspecialidadRepository.ts"
import type { MedicoRepository } from "../repository/MedicoRepository.ts"   // NUEVO (a)

export class EspecialidadService {
  private repository: EspecialidadRepository
  private medicoRepository: MedicoRepository                                // NUEVO (b)

  constructor(
    repository: EspecialidadRepository,
    medicoRepository: MedicoRepository                                      // NUEVO (b)
  ) {
    this.repository = repository
    this.medicoRepository = medicoRepository                                // NUEVO (b)
  }

  findAll(): Promise<Especialidad[]> {
    return this.repository.findAll()
  }

  findOne(id: string): Promise<Especialidad | undefined> {
    return this.repository.findOne(id)
  }

  async create(input: EspecialidadInput): Promise<Especialidad> {
    const nombre = input.nombre.trim()
    if (!nombre) throw new Error("El nombre es obligatorio")

    const duplicate = await this.repository.findByName(nombre)
    if (duplicate) throw new Error("Ya existe una especialidad con ese nombre")

    return this.repository.create({
      id: crypto.randomUUID(),
      nombre,
      descripcion: input.descripcion?.trim() ?? "",
      activa: true,
    })
  }

  async update(id: string, input: EspecialidadInput): Promise<Especialidad | undefined> {
    const current = await this.repository.findOne(id)
    if (!current) throw new Error("La especialidad no existe")

    const nombre = input.nombre.trim()
    if (!nombre) throw new Error("El nombre es obligatorio")

    const duplicate = await this.repository.findOtherByName(nombre, id)
    if (duplicate) throw new Error("Ya existe otra especialidad con ese nombre")

    return this.repository.update(id, {
      nombre,
      descripcion: input.descripcion?.trim() ?? "",
    })
  }

  async remove(id: string): Promise<{ id: string }> {
    const current = await this.repository.findOne(id)
    if (!current) throw new Error("La especialidad no existe")

    // NUEVO (c): todo este bloque
    const medicos = await this.medicoRepository.countByEspecialidad(id)
    if (medicos > 0) {
      throw new Error("No se puede eliminar: la especialidad tiene médicos asignados")
    }

    return this.repository.delete(id)
  }
}