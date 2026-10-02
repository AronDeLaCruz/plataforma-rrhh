"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../store/authStore"
import { usePostulanteStore } from "../store/postulanteStore"
import { useDocumentoStore, DOCUMENTOS } from "../store/documentoStore"
import type { Postulante } from "../types/postulante"
import type { FichaRespuestaDto } from "../types/ficha"
import { crearPostulanteVacio } from "../types/postulante"
import FichaPostulante from "../components/FichaPostulante"
import DocumentoCard from "../components/DocumentoCard"
import { on } from "events"
import axios from "axios"
import { documentoService } from "../services/api"

export default function Dashboard() {

  const MAX_BYTES = 5 * 1024 * 1024

  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const initialized = useAuthStore((s) => s.initialized)
  const init = useAuthStore((s) => s.init)
  const logout = useAuthStore((s) => s.logout)
  const { postulantes, save } = usePostulanteStore()
  const { porDni, subir } = useDocumentoStore()

  const [modalFicha, setModalFicha] = useState(false)
  const [modalInstrucciones, setModalInstrucciones] = useState(false)
  // Id que devuelve el servidor al registrar la ficha: se usa para confirmar el registro.
  const [fichaRegistrada, setFichaRegistrada] = useState<string | null>(null)
  //const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [errores, setErrores] = useState<Record<number, string>>({})
  const [estado, setEstado] = useState<Record<number, { subiendo?: boolean; error?: string }>>({})

  // El postulante que inició sesión es quien completa su propia ficha.
  // Su DNI quedó guardado en user.dni durante el login.
  const dniLogin = user?.dni ?? ""
  const propio = postulantes.find((p) => p.dni === dniLogin) ?? crearPostulanteVacio(dniLogin)
  const misDocs = porDni[dniLogin] ?? {}

  // Recupera la sesión guardada antes de decidir si hay que redirigir: evita perder la sesión
  // al recargar la página aunque el JWT siga en localStorage.
  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (initialized && !isAuthenticated) router.replace("/")
  }, [initialized, isAuthenticated, router])

  if (!initialized || !isAuthenticated) return null

  const parche = (id: number, e: { subiendo?: boolean; error?: string }) => setEstado((prev) => ({ ...prev, [id]: e }))

  // Guarda la ficha en el store local y, si el servidor respondió, muestra el id registrado.
  const guardar = (postulante: Postulante, respuesta?: FichaRespuestaDto) => {
    save(postulante)
    setModalFicha(false)
    setFichaRegistrada(respuesta?.id ?? null)
  }
  const handleLogout = () => {
    logout()
    router.replace("/")
  }
  /*const abrirArchivo = (id: number) => {
    const input = inputRefs.current[id]
    if (input) input.click()
  }//borrar*/

  const onArchivo = async (id: number, archivo: File | undefined) => {

    if (!archivo) return
    const setError = (msg: string) => setErrores((prev) => ({ ...prev, [id]: msg }))

    if (archivo.type !== "application/pdf") return setError("Solo se permiten archivos PDF.")
    if (archivo.size > MAX_BYTES) return setError("El archivo no debe superar los 5 MB.")
    
    parche(id, {subiendo:true})
    try {
      await documentoService.subir(user?.id ?? "", archivo, id)
      subir(dniLogin, id, archivo.name) // solo se marca como adjuntado si el servidor respondió OK
      parche(id, {})
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? (e.response?.data?.title ?? e.response?.data ?? "No se pudo subir el archivo.")
        : "Error inesperado."
      parche(id, { error: typeof msg === "string" ? msg : "No se pudo subir el archivo." })
    }

    setErrores(({ [id]: _, ...resto }) => resto)
    subir(dniLogin, id, archivo.name)
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Mi Proceso de Postulación</h1>
          <p className="text-sm text-slate-500">
            Bienvenido, {propio.nombres || user?.nombreCompleto || "postulante"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </header>

      {fichaRegistrada && (
        <div
          role="status"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm"
        >
          <p>
            <span className="font-semibold">Ficha registrada correctamente.</span> N° de registro:{" "}
            <span className="font-mono">{fichaRegistrada}</span>
          </p>
          <button
            type="button"
            onClick={() => setFichaRegistrada(null)}
            className="rounded-lg border border-emerald-400 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            Cerrar
          </button>
        </div>
      )}

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-700">Primera parte — Tu proceso</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setModalInstrucciones(true)}
            className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-blue-500 hover:shadow"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">📄</span>
              <span className="font-semibold text-slate-700">Instrucciones</span>
            </div>
            <p className="text-xs text-slate-500">Indicaciones previas del proceso de registro.</p>
          </button>

          <a
            href="#documentacion"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-blue-500 hover:shadow"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">🗂️</span>
              <span className="font-semibold text-slate-700">Documentación (PDF)</span>
            </div>
            <p className="text-xs text-slate-500">Adjunta cada documento requerido en PDF.</p>
          </a>
        </div>
      </section>

      <section id="documentacion">
        <h2 className="mb-1 text-lg font-semibold text-slate-700">Documentación requerida</h2>
        <p className="mb-4 text-sm text-slate-500">
          Adjunta tus documentos en formato <strong>PDF</strong>. Puedes hacerlo gradualmente.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {DOCUMENTOS.map((doc) => (
            <DocumentoCard
              key={doc.id}
              id={doc.id}
              nombre={doc.nombre}
              archivo={misDocs[doc.id]}
              error={estado[doc.id]?.error}
              subiendo={estado[doc.id]?.subiendo}
              onArchivo={onArchivo}
              onAbrirFicha={() => setModalFicha(true)}
            />
          )/*{
            // La Ficha de Personal no se sube: abre el formulario en un modal.
            const esFicha = doc.id === 1
            const archivoSubido = misDocs[doc.id]
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{doc.id}</span>
                    <span className="text-sm font-medium text-slate-700">{doc.nombre}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {esFicha
                      ? "Completa tu información y guarda los cambios."
                      : archivoSubido
                        ? `Adjuntado: ${archivoSubido}`
                        : "Sin adjuntar"}
                  </p>
                </div>
                {esFicha ? (
                  <button
                    type="button"
                    onClick={() => setModalFicha(true)}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Rellenar ficha
                  </button>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      ref={(el) => {
                        inputRefs.current[doc.id] = el
                      }}
                      onChange={(e) => {
                        onArchivo(doc.id, e.target.files?.[0])
                        e.target.value = ""
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => abrirArchivo(doc.id)}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${
                        archivoSubido ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {archivoSubido ? "Cambiar" : "Adjuntar PDF"}
                    </button>
                  </>
                )}
              </div>
            )
            
          }*/)}
        </div>
      </section>

      {modalFicha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <FichaPostulante
            key={propio.id}
            postulante={propio}
            idPostulacion={user?.id ?? ""}
            onSave={guardar}
            onCancel={() => setModalFicha(false)}
          />
        </div>
      )}

      {modalInstrucciones && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalInstrucciones(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="mb-3 text-xl font-bold text-slate-800">Instrucciones para el Postulante</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>
                Ingresar a la plataforma con el código secreto de ingreso que reciba en su correo electrónico.
              </li>
              <li>
                Una vez que haya ingresado, podrá empezar a llenar la información y cargar los documentos que se le
                piden, y podrá completar todo lo requerido en una sola sesión o en varias.
              </li>
              <li>
                Deberá leer detenidamente las instrucciones del formulario e ingresar toda la información requerida,
                verificando que sea precisa y adecuada.
              </li>
              <li>
                Adjunte su <strong>Ficha de Personal</strong> y cada documento solicitado en formato PDF.
              </li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setModalInstrucciones(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
