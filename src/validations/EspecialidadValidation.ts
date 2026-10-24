import type { EspecialidadInput } from "../models/Especialidad.ts"

const NOMBRE_MAX = 60
const DESCRIPCION_MAX = 200

export function sanitizeEspecialidadInput(raw: unknown): EspecialidadInput {
  // 1. Verificá que raw sea un objeto: typeof, null y Array.isArray.
  //    Si no lo es: throw new Error("Los datos de la especialidad son inválidos")
   if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Los datos de la especialidad son inválidos");
  }

  // 2. Convertilo a Record<string, unknown> (como hace sanitizeMedicInput)
const data = raw as Record<string, unknown>;

  // 3. nombre:
  //    - tomalo solo si es string, y aplicale trim(); si no, usá ""
  //    - si queda vacío: throw "El nombre es obligatorio"
  //    - si supera NOMBRE_MAX: throw "El nombre no puede superar los 60 caracteres"
 const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";

  if (nombre === "") {
    throw new Error("El nombre es obligatorio");
  }
  if (nombre.length > NOMBRE_MAX) {
    throw new Error("El nombre no puede superar los 60 caracteres");
  }
  // 4. descripcion:
  //    - si es undefined o null: usá ""
  //    - si no es string: throw "La descripción debe ser un texto"
  //    - aplicale trim() y verificá DESCRIPCION_MAX
  if (data.descripcion === undefined || data.descripcion === null) {
    data.descripcion = "";
  }
  if (typeof data.descripcion !== "string") {
    throw new Error("La descripción debe ser un texto");
  }

  const descripcion = data.descripcion.trim();

  if (descripcion.length > DESCRIPCION_MAX) {
    throw new Error(
      `La descripción no puede superar los ${DESCRIPCION_MAX} caracteres`
    );
  }

  // 5. devolvé { nombre, descripcion } y nada más
  return { nombre, descripcion };
}