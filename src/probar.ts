const base = "http://localhost:3001"

async function llamar(metodo: string, ruta: string, cuerpo?: unknown) {
  const respuesta = await fetch(`${base}${ruta}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  })

  const texto = await respuesta.text()
  let datos: any
  try {
    datos = JSON.parse(texto)
  } catch {
    datos = `(no es JSON) ${texto.slice(0, 60)}`
  }

  console.log(metodo, ruta, "→", respuesta.status, datos)
  return { status: respuesta.status, datos }
}

const nombre = `Prueba ${Date.now()}`

console.log("--- crear ---")
const alta = await llamar("POST", "/especialidades", { nombre })
if (alta.status !== 201) {
  console.log("No se pudo crear la especialidad de prueba. Corto acá.")
  process.exit(1)
}
const id = alta.datos.id

await llamar("POST", "/especialidades", { nombre: nombre.toLowerCase() })
await llamar("POST", "/especialidades", {})

console.log("--- leer ---")
await llamar("GET", `/especialidades/${id}`)
await llamar("GET", "/especialidades/no-existe")

console.log("--- editar ---")
await llamar("PUT", `/especialidades/${id}`, { nombre, descripcion: "Descripción nueva" })
await llamar("PUT", `/especialidades/${id}`, { nombre: "" })
await llamar("PUT", "/especialidades/no-existe", { nombre: "X" })

console.log("--- borrar ---")
await llamar("DELETE", `/especialidades/${id}`)
await llamar("DELETE", `/especialidades/${id}`)