import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { sanitizeEspecialidadInput } from "../src/validations/EspecialidadValidation.ts"

describe("sanitizeEspecialidadInput", () => {
  describe("el dato completo", () => {
    it("rechaza undefined", () => {
      assert.throws(() => sanitizeEspecialidadInput(undefined), /inválidos/)
    })

    it("rechaza null", () => {
      assert.throws(() => sanitizeEspecialidadInput(null), /inválidos/)
    })

    it("rechaza un texto suelto", () => {
      assert.throws(() => sanitizeEspecialidadInput("cardiología"), /inválidos/)
    })

    it("rechaza una lista", () => {
      assert.throws(() => sanitizeEspecialidadInput([]), /inválidos/)
    })
  })

  describe("nombre", () => {
    it("limpia los espacios de los costados", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "  Cardiología  " })
      assert.equal(resultado.nombre, "Cardiología")
    })

    it("rechaza un objeto sin nombre", () => {
      assert.throws(() => sanitizeEspecialidadInput({}), /obligatorio/)
    })

    it("rechaza un nombre con solo espacios", () => {
      assert.throws(() => sanitizeEspecialidadInput({ nombre: "   " }), /obligatorio/)
    })

    it("rechaza un nombre que no es texto", () => {
      assert.throws(() => sanitizeEspecialidadInput({ nombre: 123 }), /obligatorio/)
    })

    it("rechaza un nombre null", () => {
      assert.throws(() => sanitizeEspecialidadInput({ nombre: null }), /obligatorio/)
    })

    it("acepta un nombre de exactamente 60 caracteres", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "x".repeat(60) })
      assert.equal(resultado.nombre.length, 60)
    })

    it("rechaza un nombre de 61 caracteres", () => {
      assert.throws(
        () => sanitizeEspecialidadInput({ nombre: "x".repeat(61) }),
        /superar los 60/
      )
    })
  })

  describe("descripción", () => {
    it("queda vacía si no viene", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "Pediatría" })
      assert.equal(resultado.descripcion, "")
    })

    it("queda vacía si viene null", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "Pediatría", descripcion: null })
      assert.equal(resultado.descripcion, "")
    })

    it("limpia los espacios de los costados", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "A", descripcion: "  Corazón  " })
      assert.equal(resultado.descripcion, "Corazón")
    })

    it("rechaza una descripción que no es texto", () => {
      assert.throws(
        () => sanitizeEspecialidadInput({ nombre: "A", descripcion: 5 }),
        /debe ser un texto/
      )
    })

    it("acepta una descripción de exactamente 200 caracteres", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "A", descripcion: "x".repeat(200) })
      assert.equal(resultado.descripcion?.length, 200)
    })

    it("rechaza una descripción de 201 caracteres", () => {
      assert.throws(
        () => sanitizeEspecialidadInput({ nombre: "A", descripcion: "x".repeat(201) }),
        /superar los 200/
      )
    })
  })

  describe("campos extra", () => {
    it("los descarta y devuelve solo nombre y descripción", () => {
      const resultado = sanitizeEspecialidadInput({ nombre: "A", activa: false, id: "otro" })
      assert.deepEqual(resultado, { nombre: "A", descripcion: "" })
    })
  })
})