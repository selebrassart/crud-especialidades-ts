import { EspecialidadRepository } from "../repository/EspecialidadRepository.ts"
import { EspecialidadService } from "./EspecialidadService.ts"

const especialidadRepository = new EspecialidadRepository()

export const especialidadService = new EspecialidadService(especialidadRepository)