"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import type { FichaRespuestaDto } from "../types/ficha"
import type { Estudio, ExperienciaLaboral, Postulante } from "../types/postulante"
import { fichaService } from "../services/api"
import { aFichaDto, calcularEdad, esGuidValido, fichaVacia, mensajeDeError, nuevoId } from "../utils/ficha"
import {
  validateCelular,
  validateDNI,
  validateDocumentoNoDNI,
  validateEdad,
  validateEmail,
  validateFecha,
  validatePostulante,
} from "../utils/validation"

interface Props {
  postulante: Postulante
  // Guid de la postulación (viene con el login): el backend lo exige para registrar la ficha.
  idPostulacion: string
  // La respuesta llega sólo cuando la ficha se registró en el servidor.
  onSave: (p: Postulante, respuesta?: FichaRespuestaDto) => void
  onCancel?: () => void
}

type TipoTabla = "estudios" | "experienciaLaboral"

// Campos que se editan como texto (deja fuera la edad numérica y las tablas).
type CampoTexto = Exclude<keyof Postulante, "edad" | "estudios" | "experienciaLaboral">

// Campos editables de una fila de las tablas (claves de estudios y experiencia laboral).
type CampoFila = keyof Estudio | keyof ExperienciaLaboral

interface Columna<T> {
  // Clave de la fila que se edita (y además debe ser un campo conocido de las tablas).
  campo: keyof T & CampoFila
  etiqueta: string
  // Límite del backend para el campo (MaxLength de los DTO de educación y experiencia).
  maxLength?: number
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"

const inputErrorCls = "border-red-400 bg-red-50 focus:border-red-600 focus:ring-red-100"

const inputLabel = "mb-1 block text-xs font-semibold text-slate-600"

const MAX_ROWS = 5

// El backend (igual que el formulario PHP original) identifica el sexo y el estado civil con estos códigos.
const OPCIONES_SEXO = [
  { valor: "MA", etiqueta: "Masculino" },
  { valor: "FE", etiqueta: "Femenino" },
]

const OPCIONES_ESTADO_CIVIL = [
  { valor: "SO", etiqueta: "Soltero" },
  { valor: "CA", etiqueta: "Casado" },
  { valor: "VI", etiqueta: "Viudo" },
  { valor: "DI", etiqueta: "Divorciado" },
  { valor: "CO", etiqueta: "Conviviente" },
  { valor: "OT", etiqueta: "Otros" },
]

// Catálogo de tipos de documento de la ficha. El backend guarda su propio catálogo en la tabla
// general ("06" en el formulario PHP, con el código en coddocumento): queda por confirmar el
// mapeo exacto entre estos valores y ese catálogo.
const OPCIONES_TIPO_DOCUMENTO = [
  { valor: "DNI", etiqueta: "DNI" },
  { valor: "CE", etiqueta: "Carné de Extranjería" },
]

// Etiquetas legibles de los campos, para el resumen de datos que faltan para la ficha completa.
const ETIQUETAS_CAMPOS: Record<string, string> = {
  apat: "Apellido Paterno",
  nombres: "Nombres",
  dni: "DNI / C.E.",
  fechaNacimiento: "Fecha Nacimiento",
  edad: "Edad",
  celular: "N° Celular",
  email: "Email",
}

function MensajeError({ id, mensaje }: { id: string; mensaje?: string }) {
  if (!mensaje) return null
  return (
    <span id={id} role="alert" className="mt-1 block text-xs font-medium text-red-600">
      {mensaje}
    </span>
  )
}

export default function FichaPostulante({ postulante, idPostulacion, onSave, onCancel }: Props) {
  // Copia profunda del postulante: los arreglos no deben compartir referencia con el store de Zustand.
  const [form, setForm] = useState<Postulante>(() => ({
    ...postulante,
    estudios: (postulante.estudios ?? []).map((item) => ({ ...item })),
    experienciaLaboral: (postulante.experienciaLaboral ?? []).map((item) => ({ ...item })),
  }))
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [mensajeError, setMensajeError] = useState<string | null>(null)
  const [errorSincronizacion, setErrorSincronizacion] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const setText = (campo: CampoTexto, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }))

  const setEdad = (valor: string) =>
    setForm((prev) => ({ ...prev, edad: parseInt(valor, 10) || 0 }))

  // Al elegir la fecha de nacimiento se completa la edad automáticamente (el postulante aún puede corregirla).
  const setFechaNacimiento = (valor: string) =>
    setForm((prev) => ({ ...prev, fechaNacimiento: valor, edad: calcularEdad(valor) }))

  const claseInput = (campo: string) => (errores[campo] ? `${inputCls} ${inputErrorCls}` : inputCls)

  const agregarFila = (tipo: TipoTabla) => {
    setForm((prev) => {
      if (tipo === "estudios") {
        if (prev.estudios.length >= MAX_ROWS) return prev
        const item: Estudio = {
          id: nuevoId(),
          institucion: "",
          tituloObtenido: "",
          nivelEducativo: "",
        }
        return { ...prev, estudios: [...prev.estudios, item] }
      }
      if (prev.experienciaLaboral.length >= MAX_ROWS) return prev
      const item: ExperienciaLaboral = {
        id: nuevoId(),
        nombre: "",
        descripcion: "",
        puesto: "",
      }
      return { ...prev, experienciaLaboral: [...prev.experienciaLaboral, item] }
    })
  }

  const eliminarFila = (tipo: TipoTabla, index: number) => {
    setForm((prev) =>
      tipo === "estudios"
        ? { ...prev, estudios: prev.estudios.filter((_, i) => i !== index) }
        : { ...prev, experienciaLaboral: prev.experienciaLaboral.filter((_, i) => i !== index) },
    )
  }

  const actualizarFila = (tipo: TipoTabla, index: number, campo: CampoFila, valor: string) => {
    setForm((prev) =>
      tipo === "estudios"
        ? { ...prev, estudios: prev.estudios.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)) }
        : {
            ...prev,
            experienciaLaboral: prev.experienciaLaboral.map((item, i) =>
              i === index ? { ...item, [campo]: valor } : item,
            ),
          },
    )
  }

  // Validación de formato (política de borrador): sólo se revisa lo que ya está completado,
  // porque la ficha se puede llenar por partes en varias sesiones. El validador estricto
  // (validatePostulante) sólo se usa para avisar qué falta, sin bloquear el borrador.
  const validar = (datos: Postulante): Record<string, string> => {
    const fallos: Record<string, string> = {}
    const acumular = (resultado: { isValid: boolean; errors: Record<string, string> }) => {
      if (!resultado.isValid) Object.assign(fallos, resultado.errors)
    }

    // El DNI exige 8 dígitos; los demás documentos (C.E., pasaporte) admiten 6 a 12 caracteres.
    if (datos.dni.trim()) {
      acumular(datos.tipoDocumento === "DNI" ? validateDNI(datos.dni) : validateDocumentoNoDNI(datos.dni))
    }
    if (datos.celular.trim()) acumular(validateCelular(datos.celular))
    if (datos.email.trim()) acumular(validateEmail(datos.email))
    if (datos.fechaNacimiento) acumular(validateFecha(datos.fechaNacimiento))
    if (datos.edad > 0) acumular(validateEdad(String(datos.edad)))
    return fallos
  }

  // validatePostulante es el validador estricto (ficha completa). Aquí se usa como aviso, no como
  // bloqueo: la ficha se guarda como borrador y se informa qué falta para terminarla.
  const revision = validatePostulante(form)
  const pendientes = Object.keys(revision.errors).map((campo) => ETIQUETAS_CAMPOS[campo] ?? campo)

  // Único punto de guardado local: el registro siempre necesita id, así que si la ficha todavía no
  // lo tiene se usa el DNI. Lo usan el guardado normal y el guardado de emergencia (sin servidor).
  const guardarLocal = (respuesta?: FichaRespuestaDto) =>
    onSave({ ...form, id: form.id || form.dni }, respuesta)

  // Copia del estado con el que se abrió la ficha, para saber si hubo cambios sin guardar.
  const [fichaInicial] = useState(() => JSON.stringify(form))
  const cambiado = JSON.stringify(form) !== fichaInicial

  // Salir de la ficha: si hay cambios sin guardar, primero se confirma.
  const cancelar = () => {
    if (cambiado && !window.confirm("Hay cambios sin guardar. ¿Salir de todos modos?")) return
    onCancel?.()
  }

  const cancelarRef = useRef(cancelar)
  useEffect(() => {
    cancelarRef.current = cancelar
  })

  // La tecla ESC sale de la ficha (con la misma confirmación).
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelarRef.current()
    }
    window.addEventListener("keydown", alTeclear)
    return () => window.removeEventListener("keydown", alTeclear)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fallos = validar(form)
    setErrores(fallos)
    setErrorSincronizacion(false)

    if (Object.keys(fallos).length > 0) {
      setMensajeError("Hay campos con formato inválido. Corrígelos para continuar.")
      return
    }
    // Política de borrador: la ficha se completa por partes, pero no se guarda una ficha sin ningún dato.
    if (fichaVacia(form)) {
      setMensajeError("Todavía no hay datos que guardar. Completa al menos un dato de la ficha.")
      return
    }

    setMensajeError(null)

    // Mientras falten datos obligatorios la ficha sólo se guarda en este dispositivo: el backend
    // exige una fecha de nacimiento real y los tres campos de cada fila de las tablas.
    if (!revision.isValid) {
      guardarLocal()
      return
    }

    if (!esGuidValido(idPostulacion)) {
      // El backend identifica la postulación con un Guid: sin él la ficha no se puede registrar.
      setErrorSincronizacion(true)
      setMensajeError("No se pudo identificar tu postulación. Vuelve a iniciar sesión para enviar la ficha.")
      return
    }

    setGuardando(true)

    let respuesta: FichaRespuestaDto | undefined
    try {
      // Se envían los datos editados (form) traducidos al contrato del backend.
      respuesta = await fichaService.create(aFichaDto(form, idPostulacion), idPostulacion)
    } catch (error) {
      // El backend puede no estar disponible: se avisa y se ofrece el guardado local.
      setGuardando(false)
      setErrorSincronizacion(true)
      setMensajeError(mensajeDeError(error))
      return
    }

    setGuardando(false)
    // El store local es la fuente de verdad de la pantalla, por eso se guarda el formulario completo
    // junto con la respuesta del servidor (el Dashboard la usa para confirmar el registro).
    guardarLocal(respuesta)
  }

  // Las filas llegan por parámetro: así el tipo de la tabla queda correlacionado con sus columnas
  // y no hace falta castear el arreglo del formulario.
  const renderTabla = <T extends Estudio | ExperienciaLaboral>(
    tipo: TipoTabla,
    titulo: string,
    filas: T[],
    columnas: Columna<T>[],
  ) => {
    return (
      <div className="mt-2">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <caption className="sr-only">{titulo}</caption>
            <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
              <tr>
                {columnas.map((col) => (
                  <th key={col.campo} className="px-2 py-2">{col.etiqueta}</th>
                ))}
                <th className="px-2 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr className="border-t border-slate-200">
                  <td colSpan={columnas.length + 1} className="px-2 py-3 text-center text-xs text-slate-400">
                    Sin registros. Usa &quot;Agregar&quot; para crear una fila.
                  </td>
                </tr>
              )}
              {filas.map((item, index) => (
                <tr key={item.id || index} className="border-t border-slate-200">
                  {columnas.map((col) => (
                    <td key={col.campo} className="px-2 py-2">
                      <input
                        className={inputCls}
                        value={String(item[col.campo] ?? "")}
                        maxLength={col.maxLength}
                        aria-label={`${titulo}, fila ${index + 1}: ${col.etiqueta}`}
                        onChange={(e) => actualizarFila(tipo, index, col.campo, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => eliminarFila(tipo, index)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => agregarFila(tipo)}
          disabled={filas.length >= MAX_ROWS}
          className="mt-2 rounded-lg border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Agregar {filas.length >= MAX_ROWS ? `(${MAX_ROWS} máximo)` : ""}
        </button>
        {filas.length >= MAX_ROWS && (
          <p className="mt-1 text-xs text-slate-500">Puedes agregar hasta {MAX_ROWS} registros.</p>
        )}
      </div>
    )
  }

  // Si la ficha trae un tipo de documento fuera del catálogo, se conserva para no perder el dato.
  const opcionesDocumento =
    form.tipoDocumento && !OPCIONES_TIPO_DOCUMENTO.some((op) => op.valor === form.tipoDocumento)
      ? [...OPCIONES_TIPO_DOCUMENTO, { valor: form.tipoDocumento, etiqueta: form.tipoDocumento }]
      : OPCIONES_TIPO_DOCUMENTO

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      role="dialog"
      aria-modal="true"
      aria-label="Ficha de Datos Personales"
      className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-800">Ficha de Datos Personales (resumida)</h2>
      </div>

      {mensajeError && (
        <div
          role="alert"
          className="sticky top-0 z-10 mb-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {mensajeError}
        </div>
      )}

      <h3 className="mb-2 border-b border-slate-200 pb-1 text-sm font-semibold text-slate-600">
        I. DATOS PERSONALES
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Apellido Paterno</span>
          <input className={inputCls} value={form.apat} onChange={(e) => setText("apat", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Apellido Materno</span>
          <input className={inputCls} value={form.amat} onChange={(e) => setText("amat", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Nombres</span>
          <input className={inputCls} value={form.nombres} onChange={(e) => setText("nombres", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Tipo Documento</span>
          <select
            className={inputCls}
            value={form.tipoDocumento}
            onChange={(e) => setText("tipoDocumento", e.target.value)}
          >
            {!form.tipoDocumento && <option value="">Seleccione…</option>}
            {opcionesDocumento.map((op) => (
              <option key={op.valor} value={op.valor}>
                {op.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>DNI / C.E.</span>
          <input
            className={claseInput("dni")}
            value={form.dni}
            maxLength={12}
            inputMode={form.tipoDocumento === "DNI" ? "numeric" : undefined}
            placeholder={form.tipoDocumento === "DNI" ? "Ej. 12345678" : "6 a 12 caracteres"}
            aria-invalid={Boolean(errores.dni)}
            aria-describedby={errores.dni ? "error-dni" : undefined}
            onChange={(e) => setText("dni", e.target.value)}
          />
          <MensajeError id="error-dni" mensaje={errores.dni} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Fecha Nacimiento</span>
          <input
            type="date"
            className={claseInput("fechaNacimiento")}
            value={form.fechaNacimiento}
            aria-invalid={Boolean(errores.fechaNacimiento)}
            aria-describedby={errores.fechaNacimiento ? "error-fechaNacimiento" : undefined}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
          <MensajeError id="error-fechaNacimiento" mensaje={errores.fechaNacimiento} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Edad</span>
          <input
            type="number"
            min={0}
            max={120}
            className={claseInput("edad")}
            value={form.edad}
            aria-invalid={Boolean(errores.edad)}
            aria-describedby={errores.edad ? "error-edad" : undefined}
            onChange={(e) => setEdad(e.target.value)}
          />
          <MensajeError id="error-edad" mensaje={errores.edad} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Dirección</span>
          <input className={inputCls} value={form.direccion} onChange={(e) => setText("direccion", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Departamento</span>
          <input
            className={inputCls}
            value={form.departamento}
            onChange={(e) => setText("departamento", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Provincia</span>
          <input className={inputCls} value={form.provincia} onChange={(e) => setText("provincia", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Distrito</span>
          <input className={inputCls} value={form.distrito} onChange={(e) => setText("distrito", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>N° Celular</span>
          <input
            className={claseInput("celular")}
            value={form.celular}
            maxLength={9}
            inputMode="numeric"
            aria-invalid={Boolean(errores.celular)}
            aria-describedby={errores.celular ? "error-celular" : undefined}
            onChange={(e) => setText("celular", e.target.value)}
          />
          <MensajeError id="error-celular" mensaje={errores.celular} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Teléfono Fijo</span>
          <input
            className={inputCls}
            value={form.telefonoFijo}
            onChange={(e) => setText("telefonoFijo", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Email</span>
          <input
            type="email"
            className={claseInput("email")}
            value={form.email}
            aria-invalid={Boolean(errores.email)}
            aria-describedby={errores.email ? "error-email" : undefined}
            onChange={(e) => setText("email", e.target.value)}
          />
          <MensajeError id="error-email" mensaje={errores.email} />
        </label>
      </div>

      <h3 className="mt-4 mb-2 border-b border-slate-200 pb-1 text-sm font-semibold text-slate-600">
        II. ESTUDIOS
      </h3>
      {renderTabla("estudios", "Estudios", form.estudios, [
        { campo: "institucion", etiqueta: "Institución", maxLength: 150 },
        { campo: "tituloObtenido", etiqueta: "Título obtenido", maxLength: 150 },
        { campo: "nivelEducativo", etiqueta: "Nivel educativo", maxLength: 150 },
      ])}

      <h3 className="mt-4 mb-2 border-b border-slate-200 pb-1 text-sm font-semibold text-slate-600">
        III. EXPERIENCIA LABORAL
      </h3>
      {renderTabla("experienciaLaboral", "Experiencia laboral", form.experienciaLaboral, [
        { campo: "nombre", etiqueta: "Nombre / Empresa", maxLength: 150 },
        { campo: "descripcion", etiqueta: "Descripción", maxLength: 500 },
        { campo: "puesto", etiqueta: "Puesto", maxLength: 150 },
      ])}

      <h3 className="mt-4 mb-2 border-b border-slate-200 pb-1 text-sm font-semibold text-slate-600">
        LUGAR DE NACIMIENTO
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Nacionalidad</span>
          <input
            className={inputCls}
            value={form.nacionalidad}
            onChange={(e) => setText("nacionalidad", e.target.value)}
          />
        </label>
      </div>

      <h3 className="mt-4 mb-2 border-b border-slate-200 pb-1 text-sm font-semibold text-slate-600">
        CUENTA BANCARIA
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>Banco</span>
          <input className={inputCls} value={form.banco} onChange={(e) => setText("banco", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={inputLabel}>N° de Cuenta</span>
          <input
            className={inputCls}
            value={form.cuenta}
            inputMode="numeric"
            onChange={(e) => setText("cuenta", e.target.value)}
          />
        </label>
      </div>

      <h3 className="mt-4 mb-2 border-b border-slate-200 pb-1 text-sm font-semibold text-slate-600">
        SEXO Y ESTADO CIVIL
      </h3>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <fieldset>
          <legend className={inputLabel}>Sexo</legend>
          <div className="mt-1 flex gap-3">
            {OPCIONES_SEXO.map((op) => (
              <label key={op.valor} className="flex cursor-pointer items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="sexo"
                  value={op.valor}
                  checked={form.sexo === op.valor}
                  onChange={() => setText("sexo", op.valor)}
                />
                <span>{op.etiqueta}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className={inputLabel}>Estado Civil</legend>
          <div className="mt-1 flex flex-wrap gap-3">
            {OPCIONES_ESTADO_CIVIL.map((op) => (
              <label key={op.valor} className="flex cursor-pointer items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="civil"
                  value={op.valor}
                  checked={form.estadoCivil === op.valor}
                  onChange={() => setText("estadoCivil", op.valor)}
                />
                <span>{op.etiqueta}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <p className="mr-auto text-xs text-slate-500">
          {revision.isValid ? (
            <span className="font-semibold text-emerald-600">Ficha completa</span>
          ) : (
            <>
              <span className="font-semibold text-slate-600">Se guardará como borrador.</span> Falta completar:{" "}
              {pendientes.join(", ")}.
            </>
          )}
        </p>
        {onCancel && (
          <button
            type="button"
            onClick={cancelar}
            disabled={guardando}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        {errorSincronizacion && (
          <button
            type="button"
            onClick={() => guardarLocal()}
            className="rounded-lg border border-amber-500 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
          >
            Guardar sólo en este dispositivo
          </button>
        )}
        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? "Guardando…" : revision.isValid ? "Guardar ficha" : "Guardar borrador"}
        </button>
      </div>
    </form>
  )
}
