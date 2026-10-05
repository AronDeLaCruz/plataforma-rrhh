export type { LoginPayload, LoginResponse, User, UsuarioApi } from "./auth";

/** Puesto devuelto por GET /Puesto */
export interface Puesto {
  id: string | number;
  titulo: string;
}

/** Tipo de documento del catálogo del sistema (checklist del legajo). */
export interface DocumentoTipo {
  id: number;
  nombre: string;
  /** El backend lo llama `requerido`: si es obligatorio en el legajo. */
  requerido?: boolean;
  activo?: boolean;
  orden?: number;
  /** Extensiones separadas por coma, ej. ".pdf,.jpg,.png". */
  extensionesPermitidas?: string;
  tamanoMaximoBytes?: number;
}

/**
 * Archivo que el backend asocia a un tipo de documento de la postulación.
 * Se admiten los alias que use el backend: el listado usa `idDocumento`/`archivoUrl`
 * y el detalle (`GET /Postulacion/{id}/detalle`) usa `tipoDocumento`/`urlArchivo`.
 */
export interface DocumentoPostulante {
  /**
   * Id del registro del documento en el backend (el "código" del PDF). Es el parámetro que
   * espera `GET /Postulacion/{id}/documento`; no confundir con el id del tipo de documento.
   */
  id?: string | number;
  /** Alias del id del registro del documento. */
  idDocumentoPostulante?: string | number;
  idDocumento?: number | string;
  idTipoDocumento?: number | string;
  documentoTipoId?: number | string;
  /** Alias del detalle: id del tipo de documento (ej. 7). */
  tipoDocumento?: number | string;
  nombre?: string;
  /** Alias del detalle: nombre original del archivo subido. */
  nombreDocumento?: string;
  archivoUrl?: string;
  url?: string;
  /** Alias del detalle: ruta relativa del archivo (ej. "/files/postulaciones/..."). */
  urlArchivo?: string;
}

/** Postulación devuelta por GET /Postulacion (se admiten los alias que use el backend) */
export interface Postulante {
  id: string | number;
  codigo?: string;
  nombreCompleto?: string;
  nombre?: string;
  apellido?: string;
  tipoDocumento?: string;
  dni?: string;
  numeroDocumento?: string;
  puesto?: string;
  puestoNombre?: string;
  estado?: string;
  email?: string;
  telefono?: string;
  /** Documentos adjuntos de la postulación (opcional: puede no venir en el listado). */
  documentos?: DocumentoPostulante[];
}

/** Documento devuelto dentro del detalle de la postulación (GET /Postulacion/{id}/detalle). */
export interface DocumentoDetalle extends DocumentoPostulante {
  id: string;
  tipoDocumento: number;
  nombreDocumento: string;
  urlArchivo: string;
  fechaSubida?: string;
}

/** Estudios registrados en la ficha del postulante. */
export interface EducacionPostulante {
  id: string;
  institucion?: string;
  nivelEducativo?: string;
  tituloObtenido?: string;
}

/** Experiencia laboral registrada en la ficha del postulante. */
export interface ExperienciaPostulante {
  id: string;
  nombre?: string;
  puesto?: string;
  descripcion?: string;
}

/** Ficha de datos personales que llega dentro del detalle de la postulación. */
export interface FichaPostulante {
  id?: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  email?: string;
  numeroCelular?: string;
  numeroFijo?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departament?: string;
  edad?: number;
  sexo?: string;
  estadoCivil?: string;
  fechaNacimiento?: string;
  educacion?: EducacionPostulante[];
  experiencia?: ExperienciaPostulante[];
}

/** Respuesta de GET /Postulacion/{id}/detalle */
export interface PostulacionDetalle {
  idPostulacion: string;
  dni?: string;
  nombreCompleto?: string;
  puesto?: string;
  estadoPostulacion?: string;
  documentos: DocumentoDetalle[];
  ficha?: FichaPostulante;
}

/* ------------------------------------------------------------------ */
/* Legajos (contrato asumido: el backend de empleados todavía no existe) */
/* ------------------------------------------------------------------ */

/** Documento dentro de un legajo (GET /Empleado/{id}/legajos). Se admiten los alias del backend. */
export interface DocumentoLegajoApi {
  /** Id del registro del documento: parámetro de descarga del archivo. */
  id?: string | number;
  idDocumento?: string | number;
  nombre?: string;
  /** Alias: nombre original del archivo subido. */
  nombreDocumento?: string;
  /** Alias: "Contrato", "Pago", "Certificado", ... */
  tipo?: string;
  tipoDocumento?: string;
  archivoUrl?: string;
  url?: string;
  urlArchivo?: string;
}

/** Legajo (carpeta) de un empleado. */
export interface LegajoApi {
  id?: string | number;
  idLegajo?: string | number;
  nombre?: string;
  nombreLegajo?: string;
  documentos?: DocumentoLegajoApi[];
}

/** Empleado devuelto por GET /Empleado (se admiten los alias que use el backend). */
export interface EmpleadoApi {
  id?: string | number;
  /** Código de documento visible en la tabla (ej. "EMP-0001"). */
  codigo?: string;
  documento?: string;
  nroDocumento?: string;
  apellidosNombres?: string;
  nombreCompleto?: string;
  activo?: boolean;
  /** Alias de `activo` cuando el backend manda el estado como texto. */
  estado?: string;
  dni?: string;
  email?: string;
  correo?: string;
  telefono?: string;
  celular?: string;
  cargo?: string;
  puesto?: string;
  fechaIngreso?: string;
  fechaAlta?: string;
  legajos?: LegajoApi[];
}

/**
 * Documento de una postulación en el detalle del legajo por DNI
 * (GET /Postulante/{dni}/legajo): puede traer solo el tipo y su estado.
 */
export interface DocumentoPostulacionApi {
  tipoDocumento?: number | string;
  idDocumento?: number | string;
  id?: number | string;
  nombre?: string;
  nombreDocumento?: string;
  /** Estado del archivo subido (ej. "ACTIVO"). */
  estado?: string;
  /** Ruta del archivo, si el backend la expone (respaldo del visor). */
  archivoUrl?: string;
  url?: string;
  urlArchivo?: string;
}

/** Postulación (carpeta del legajo) en el detalle del legajo por DNI. */
export interface PostulacionLegajoApi {
  id?: string | number;
  puesto?: string;
  estado?: string;
  fechaPostulacion?: string;
  /** El backend solo informa si la ficha de datos existe, no la manda como documento. */
  tieneFicha?: boolean;
  documentosSubidos?: number;
  documentos?: DocumentoPostulacionApi[];
}

/** Detalle del postulante devuelto al consultar su legajo por DNI. */
export interface PostulanteLegajoApi {
  postulanteId?: string | number;
  nombreCompleto?: string;
  dni?: string;
  postulaciones?: PostulacionLegajoApi[];
}

/* ------------------------------------------------------------------ */
/* Modelos de vista de la pantalla de legajos (ya normalizados)        */
/* ------------------------------------------------------------------ */

/** Documento de un legajo listo para pintar en el modal. */
export interface DocumentoLegajo {
  /** Id del registro del documento; null si el backend no lo expone (no se puede descargar). */
  id: string | null;
  nombre: string;
  /** Etiqueta del chip: tipo/categoría del documento o su estado (ej. "Contrato", "ACTIVO"). */
  tipo: string;
  /**
   * Ruta del archivo en el servidor (ej. "/files/postulaciones/..."). Solo se usa como respaldo
   * del visor cuando el backend no expone el id de registro del documento.
   */
  archivoUrl?: string | null;
}

/**
 * Postulación del empleado (carpeta del legajo) con sus documentos, lista para pintar en el modal.
 * El `nombre` se conserva como etiqueta de respaldo del detalle del legajo por DNI.
 */
export interface Legajo {
  id: string;
  nombre: string;
  documentos: DocumentoLegajo[];
  /** Puesto al que postuló (resumen de la tarjeta). */
  puesto?: string;
  /** Estado de la postulación (ej. "Aprobado", "Pendiente"). */
  estado?: string;
  /** Fecha de la postulación (resumen de la tarjeta). */
  fechaPostulacion?: string;
  /** Documentos efectivamente subidos; si el backend no lo informa, se calcula con los documentos. */
  documentosSubidos?: number;
  /** Total de documentos que componen el legajo/catálogo. */
  totalDocumentos?: number;
  /** El backend informa si la ficha de datos está registrada. */
  tieneFicha?: boolean;
}

/** Empleado listo para pintar en la tabla y en el modal de legajo. */
export interface Empleado {
  /** Id del empleado en el backend; null cuando el dato viene de ejemplo (mock). */
  id: string | null;
  codigo: string;
  apellidosNombres: string;
  activo: boolean;
  dni: string;
  email: string;
  telefono: string;
  cargo: string;
  fechaIngreso: string;
  legajos: Legajo[];
}

