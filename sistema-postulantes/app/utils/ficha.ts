// Funciones puras de la ficha del postulante (sin React, fáciles de probar y reutilizar).

import type { CrearFichaDto } from "../types/ficha"
import type { Estudio, ExperienciaLaboral, Postulante } from "../types/postulante"

// Las filas nuevas necesitan un id propio para no repetir la key de React.
export const nuevoId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `tmp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

// Edad calculada a partir de la fecha de nacimiento (sin desfases de zona horaria).
export function calcularEdad(fecha: string): number {
  const [anio, mes, dia] = fecha.split("-").map(Number)
  if (!anio || !mes || !dia) return 0

  const nacimiento = new Date(anio, mes - 1, dia)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const difMes = hoy.getMonth() - nacimiento.getMonth()
  if (difMes < 0 || (difMes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1
  return edad > 0 ? edad : 0
}

// Mensaje legible para el usuario a partir de la respuesta del backend / red.
export function mensajeDeError(error: unknown): string {
  const err = error as { message?: string; response?: { data?: unknown } }
  const data = err?.response?.data
  const detalle =
    typeof data === "string"
      ? data
      : data && typeof data === "object" && typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : undefined
  return `No se pudo guardar en el servidor: ${detalle ?? err?.message ?? "verifica tu conexión"}`
}

// Campos que sólo completa el postulante dentro de la ficha: el id, el dni, el tipo de documento
// y la nacionalidad llegan del login o del registro vacío, así que no cuentan como datos.
const CAMPOS_DE_FICHA: (keyof Postulante)[] = [
  "apat",
  "amat",
  "nombres",
  "fechaNacimiento",
  "direccion",
  "departamento",
  "provincia",
  "distrito",
  "celular",
  "telefonoFijo",
  "email",
  "banco",
  "cuenta",
  "sexo",
  "estadoCivil",
]

// ¿La ficha sigue sin ningún dato propio? Sirve para no guardar registros totalmente vacíos.
export function fichaVacia(postulante: Postulante): boolean {
  const hayCampos = CAMPOS_DE_FICHA.some((campo) => {
    const valor = postulante[campo]
    return typeof valor === "string" && valor.trim() !== ""
  })
  return (
    !hayCampos &&
    postulante.edad <= 0 &&
    postulante.estudios.length === 0 &&
    postulante.experienciaLaboral.length === 0
  )
}

// ¿El valor es un Guid con el que el backend pueda localizar la postulación?
export function esGuidValido(valor: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(valor.trim())
}

// Las filas incompletas no se envían: el backend marca obligatorios los tres campos de cada tabla.
export function filaEducacionValida(estudio: Estudio): boolean {
  return (
    estudio.institucion.trim() !== "" && estudio.tituloObtenido.trim() !== "" && estudio.nivelEducativo.trim() !== ""
  )
}

export function filaExperienciaValida(experiencia: ExperienciaLaboral): boolean {
  return experiencia.nombre.trim() !== "" && experiencia.descripcion.trim() !== "" && experiencia.puesto.trim() !== ""
}

// Traduce la ficha local al contrato del backend (CrearFichaDto). El backend no tiene destino para
// nacionalidad, banco ni cuenta: esos datos se quedan sólo en el borrador local del dispositivo.
export function aFichaDto(postulante: Postulante, idPostulacion: string): CrearFichaDto {
  const educacion = postulante.estudios.filter(filaEducacionValida).map((estudio) => ({
    institucion: estudio.institucion,
    tituloObtenido: estudio.tituloObtenido,
    nivelEducativo: estudio.nivelEducativo,
  }))

  const experiencia = postulante.experienciaLaboral.filter(filaExperienciaValida).map((fila) => ({
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    puesto: fila.puesto,
  }))

  return {
    idPostulacion,
    nombres: postulante.nombres,
    apellidoPaterno: postulante.apat,
    apellidoMaterno: postulante.amat,
    tipoDocumento: postulante.tipoDocumento,
    numeroDocumento: postulante.dni,
    fechaNacimiento: postulante.fechaNacimiento,
    edad: postulante.edad,
    direccion: postulante.direccion,
    // El backend nombra este campo "departament" (sin la "o" final): viaja tal cual.
    departament: postulante.departamento,
    provincia: postulante.provincia,
    distrito: postulante.distrito,
    numeroCelular: postulante.celular,
    numeroFijo: postulante.telefonoFijo,
    email: postulante.email,
    sexo: postulante.sexo,
    estadoCivil: postulante.estadoCivil,
    educacion: educacion.length > 0 ? educacion : null,
    experiencia: experiencia.length > 0 ? experiencia : null,
  }
}

