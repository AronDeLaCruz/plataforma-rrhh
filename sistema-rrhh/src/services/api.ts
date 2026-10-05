import axios from "axios";
import { DOCUMENTOS, ID_FICHA_PERSONAL } from "@/constants/documentos";
import type { LoginPayload } from "@/types/auth";
import type {
  DocumentoLegajo,
  DocumentoLegajoApi,
  DocumentoPostulacionApi,
  DocumentoTipo,
  Empleado,
  EmpleadoApi,
  Legajo,
  LegajoApi,
  PostulacionDetalle,
  PostulanteLegajoApi,
  UsuarioApi,
} from "@/types";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5253/api").replace(
  /\/$/,
  "",
);

/** Origen del servidor sin el path de la API (los archivos se sirven desde la raíz, no bajo /api). */
const ORIGIN_URL = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return API_URL.replace(/\/api\/?$/, "");
  }
})();

/**
 * El backend devuelve las rutas de archivo relativas (ej. "/files/postulaciones/..."),
 * pero se sirven desde la raíz del servidor, no bajo /api. Se completa con el origen.
 */
export function resolverUrlArchivo(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${ORIGIN_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Acción a ejecutar cuando el backend responde 401 (la registra el store para evitar import circular). */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // La app no usa router: se limpia la sesión y App vuelve a renderizar el Login.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export function unwrapLogin(payload: unknown): LoginPayload {
  if (payload && typeof payload === "object" && "token" in payload && "nombre" in payload && "rol" in payload) {
    return payload as LoginPayload;
  }
  throw new Error("Respuesta de login inesperada");
}

/** Valida y normaliza la respuesta del detalle de la postulación (se admite el envoltorio { data }). */
export function unwrapPostulacionDetalle(payload: unknown): PostulacionDetalle {
  const base =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;

  if (base && typeof base === "object" && ("documentos" in base || "idPostulacion" in base)) {
    const detalle = base as PostulacionDetalle;
    return { ...detalle, documentos: Array.isArray(detalle.documentos) ? detalle.documentos : [] };
  }
  throw new Error("Respuesta de detalle de postulación inesperada");
}

/* ------------------------------------------------------------------ */
/* Legajos: normalización del contrato asumido del backend            */
/* ------------------------------------------------------------------ */

/** `true` si el valor tiene contenido (descarta null/undefined/cadenas vacías). */
function tieneValor(valor: string | number | boolean | null | undefined): boolean {
  return valor !== undefined && valor !== null && valor !== "";
}

/** Convierte un id de cualquier tipo a texto (null si viene vacío). */
function idATexto(valor: string | number | null | undefined): string | null {
  return tieneValor(valor) ? String(valor) : null;
}

/** Texto de respaldo cuando el backend no manda el campo. */
function textoODefecto(valor: string | number | null | undefined, defecto: string): string {
  return tieneValor(valor) ? String(valor) : defecto;
}

/** Deriva "activo" del estado cuando el backend no manda el booleano. */
function derivarActivo(dto: EmpleadoApi): boolean {
  if (typeof dto.activo === "boolean") return dto.activo;
  const estado = dto.estado?.trim().toLowerCase();
  if (!estado) return true;
  return !["inactivo", "cesado", "baja", "retirado"].includes(estado);
}

/** Normaliza un documento del legajo (nombre/tipo para la lista, id para descargar). */
export function adaptarDocumentoLegajo(dto: DocumentoLegajoApi): DocumentoLegajo {
  const id = idATexto(dto.id ?? dto.idDocumento);
  const nombre = dto.nombreDocumento ?? dto.nombre;
  return {
    id,
    nombre: textoODefecto(nombre, id ? `documento-${id}.pdf` : "Documento.pdf"),
    tipo: textoODefecto(dto.tipo ?? dto.tipoDocumento, "Documento"),
    // Ruta del archivo: solo respaldo del visor cuando no hay id de registro.
    archivoUrl: dto.urlArchivo ?? dto.url ?? dto.archivoUrl ?? null,
  };
}

/** Normaliza un legajo (carpeta) con sus documentos; nunca devuelve `documentos` undefined. */
export function adaptarLegajo(dto: LegajoApi, indice: number): Legajo {
  const id = idATexto(dto.id ?? dto.idLegajo);
  const documentos = Array.isArray(dto.documentos) ? dto.documentos.map(adaptarDocumentoLegajo) : [];
  return {
    id: id ?? `legajo-${indice + 1}`,
    nombre: textoODefecto(dto.nombre ?? dto.nombreLegajo, `Legajo ${indice + 1}`),
    documentos,
    totalDocumentos: documentos.length,
  };
}

/** Normaliza un empleado del listado; garantiza `legajos` como arreglo. */
export function adaptarEmpleado(dto: EmpleadoApi): Empleado {
  return {
    id: idATexto(dto.id),
    codigo: textoODefecto(dto.codigo ?? dto.documento ?? dto.nroDocumento ?? dto.dni, "-"),
    apellidosNombres: textoODefecto(dto.apellidosNombres ?? dto.nombreCompleto, "-"),
    activo: derivarActivo(dto),
    dni: textoODefecto(dto.dni, "-"),
    email: textoODefecto(dto.email ?? dto.correo, "-"),
    telefono: textoODefecto(dto.telefono ?? dto.celular, "-"),
    cargo: textoODefecto(dto.cargo ?? dto.puesto, "-"),
    fechaIngreso: textoODefecto(dto.fechaIngreso ?? dto.fechaAlta, "-"),
    legajos: Array.isArray(dto.legajos) ? dto.legajos.map(adaptarLegajo) : [],
  };
}

/** Desenvuelve el `{ data }` del backend y valida que la respuesta sea una lista. */
function unwrapLista(payload: unknown, mensaje: string): unknown[] {
  const base =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;

  if (Array.isArray(base)) return base;
  throw new Error(mensaje);
}

/** Lista de empleados del backend (se admite el envoltorio { data }). */
export function unwrapEmpleados(payload: unknown): EmpleadoApi[] {
  return unwrapLista(payload, "Respuesta de listado de empleados inesperada") as EmpleadoApi[];
}

/* --- Detalle del legajo por DNI: GET /Postulante/{dni}/legajo --- */

/** Nombre del documento en el catálogo del sistema a partir del tipo que manda el backend. */
function nombreDocumentoCatalogo(tipo: number | string | null | undefined): string | null {
  const id = Number(tipo);
  if (!Number.isFinite(id)) return null;
  return DOCUMENTOS.find((documento) => documento.id === id)?.nombre ?? null;
}

/** Normaliza un documento del detalle por DNI: solo trae el tipo y su estado. */
function adaptarDocumentoDePostulacion(dto: DocumentoPostulacionApi): DocumentoLegajo {
  const id = idATexto(dto.idDocumento ?? dto.id);
  const tipo = dto.tipoDocumento;
  return {
    id,
    nombre: textoODefecto(
      dto.nombreDocumento ?? dto.nombre ?? nombreDocumentoCatalogo(tipo),
      id ? `documento-${id}.pdf` : `Documento ${textoODefecto(tipo, "sin tipo")}`,
    ),
    // El chip muestra el estado del archivo (ACTIVO/PENDIENTE); si no viene, el tipo de documento.
    tipo: textoODefecto(dto.estado, "Documento"),
    archivoUrl: dto.urlArchivo ?? dto.url ?? dto.archivoUrl ?? null,
  };
}

/**
 * Convierte el detalle del postulante (consultado por DNI) en legajos: cada postulación es una
 * carpeta y cada `tipoDocumento` su documento, con el nombre del catálogo del sistema.
 */
export function adaptarLegajosDesdePostulante(dto: PostulanteLegajoApi): Legajo[] {
  // Documentos adjuntables del catálogo (la ficha de datos no es un archivo).
  const totalCatalogo = DOCUMENTOS.length - 1;

  return (dto.postulaciones ?? []).map((postulacion, indice) => {
    const id = idATexto(postulacion.id);
    const documentos = (postulacion.documentos ?? []).map(adaptarDocumentoDePostulacion);

    // La ficha de datos también es parte del legajo: el backend solo informa si existe.
    if (postulacion.tieneFicha) {
      const ficha = DOCUMENTOS.find((documento) => documento.id === ID_FICHA_PERSONAL);
      documentos.unshift({ id: null, nombre: ficha?.nombre ?? "Ficha de Personal", tipo: "Datos" });
    }

    const nombre = [postulacion.puesto, postulacion.estado].filter((valor) => tieneValor(valor)).join(" · ");

    // Los documentos subidos salen del backend cuando los informa; si no, se cuentan los adjuntos.
    const subidos = tieneValor(postulacion.documentosSubidos)
      ? Number(postulacion.documentosSubidos)
      : documentos.filter((documento) => tieneValor(documento.id)).length;

    return {
      id: id ?? `postulacion-${indice + 1}`,
      nombre: nombre || `Postulación ${indice + 1}`,
      documentos,
      puesto: tieneValor(postulacion.puesto) ? String(postulacion.puesto) : undefined,
      estado: tieneValor(postulacion.estado) ? String(postulacion.estado) : undefined,
      fechaPostulacion: tieneValor(postulacion.fechaPostulacion) ? String(postulacion.fechaPostulacion) : undefined,
      documentosSubidos: subidos,
      totalDocumentos: totalCatalogo,
      tieneFicha: postulacion.tieneFicha ?? false,
    };
  });
}

/** Valida el detalle del legajo por DNI (objeto con `postulaciones` / `postulanteId`). */
export function unwrapLegajoPostulante(payload: unknown): PostulanteLegajoApi {
  const base =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;

  if (base && typeof base === "object" && ("postulaciones" in base || "postulanteId" in base)) {
    const detalle = base as PostulanteLegajoApi;
    return { ...detalle, postulaciones: Array.isArray(detalle.postulaciones) ? detalle.postulaciones : [] };
  }
  throw new Error("Respuesta de legajo del postulante inesperada");
}

/**
 * Legajos del detalle admitiendo las dos formas posibles del backend: el arreglo de legajos
 * o el detalle del postulante por DNI (postulaciones con sus documentos).
 */
export function unwrapLegajosDetalle(payload: unknown): Legajo[] {
  const base =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;

  if (Array.isArray(base)) {
    return base.map((dto, indice) => adaptarLegajo(dto as LegajoApi, indice));
  }

  return adaptarLegajosDesdePostulante(unwrapLegajoPostulante(base));
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginPayload> => {
    const response = await api.post<unknown>("/Auth/login", { email, password });
    return unwrapLogin(response.data);
  },
};

export const postulacionService = {
  crear: async (datos: unknown): Promise<unknown> => {
    const response = await api.post("/Postulacion", datos);
    return response.data;
  },

  obtener: async (): Promise<unknown> => {
    const response = await api.get("/Postulacion");
    return response.data;
  },

  detalles: async (id: string): Promise<PostulacionDetalle> => {
    const response = await api.get<unknown>(`/Postulacion/${id}/detalle`);
    return unwrapPostulacionDetalle(response.data);
  }, 
  documento: async (id: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/Postulacion/${id}/documento`, { responseType: "blob"});
    return response.data;
  }

};

export const puestoService = {
  crear: async (datos: unknown): Promise<unknown> => {
    const response = await api.post("/Puesto", datos);
    return response.data;
  },

  listado: async (): Promise<unknown> => {
    const response = await api.get("/Puesto");
    return response.data;
  }
};

/**
 * Legajos del empleado. Rutas reales del backend: el listado sale de /Postulante y el detalle
 * se consulta por DNI. TODO(backend): confirmar el endpoint de descarga de cada documento.
 */
export const legajoService = {
  /** Listado de postulantes/empleados del sistema. */
  listado: async (): Promise<Empleado[]> => {
    const response = await api.get<unknown>("/Postulante");
    return unwrapEmpleados(response.data).map(adaptarEmpleado);
  },

  /**
   * Carpetas (legajos) con sus documentos, consultadas por DNI del postulante:
   * GET /Postulante/{dni}/legajo devuelve el detalle con sus postulaciones y documentos.
   */
  detalle: async (dni: string): Promise<Legajo[]> => {
    const response = await api.get<unknown>(`/Postulante/${encodeURIComponent(dni)}/legajo`);
    return unwrapLegajosDetalle(response.data);
  },

  /**
   * PDF de un documento del legajo, descargado con la sesión autenticada.
   * Asumido: GET /Empleado/documento/{idDocumento}
   */
  documento: async (idDocumento: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/Empleado/documento/${idDocumento}`, {
      responseType: "blob",
    });
    return response.data;
  }
};

export const tipoDocumentoService = {
  listado: async (): Promise<DocumentoTipo[]> => {
    const response = await api.get<unknown>("/TipoDocumento");
    const items = unwrapLista(response.data, "Respuesta de tipos de documento inesperada");
    return (items as DocumentoTipo[])
      .filter((t) => t && typeof t === "object")
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  },
};

export const usuarioService = {
  listado: async (): Promise<UsuarioApi[]> => {
    const response = await api.get<unknown>("/Usuario");
    return unwrapLista(response.data, "Respuesta de usuarios inesperada") as UsuarioApi[];
  },
  crear: async (datos: { nombre: string; email: string; password: string; rol: string }): Promise<UsuarioApi> => {
    const response = await api.post<unknown>("/Usuario", datos);
    const base =
      response.data && typeof response.data === "object" && "data" in response.data
        ? (response.data as { data: unknown }).data
        : response.data;
    return base as UsuarioApi;
  },
  estado: async (id: string, activo: boolean): Promise<UsuarioApi> => {
    const response = await api.patch<unknown>(`/Usuario/${encodeURIComponent(id)}/estado`, { activo });
    const base =
      response.data && typeof response.data === "object" && "data" in response.data
        ? (response.data as { data: unknown }).data
        : response.data;
    return base as UsuarioApi;
  },
};