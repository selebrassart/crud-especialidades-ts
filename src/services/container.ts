import { EspecialidadRepository } from "../repository/EspecialidadRepository.ts"
import { MedicoRepository } from "../repository/MedicoRepository.ts"
import { EspecialidadService } from "./EspecialidadService.ts"

const especialidadRepository = new EspecialidadRepository()
const medicoRepository = new MedicoRepository()

export const especialidadService = new EspecialidadService(
  especialidadRepository,
  medicoRepository
)