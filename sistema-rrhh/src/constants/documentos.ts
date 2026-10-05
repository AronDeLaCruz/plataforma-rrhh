import type { DocumentoPostulante, DocumentoTipo } from "@/types";

/** El id 1 del catálogo es la ficha de datos: no es un archivo, se renderiza con los datos del postulante. */
export const ID_FICHA_PERSONAL = 1;

/** Catálogo de documentos que se solicitan en el legajo del postulante. */
export const DOCUMENTOS: DocumentoTipo[] = [
  { id: 1, nombre: "Ficha de Personal" },
  { id: 2, nombre: "Certificado de Antecedentes Policiales" },
  { id: 3, nombre: "Certificado de Antecedentes Judiciales" },
  { id: 4, nombre: "Constancia de RETCC (solo R. Civil)" },
  { id: 5, nombre: "Declaración Jurada de Domicilio" },
  { id: 6, nombre: "Declaración Jurada de Afiliación al Sistema de Pensiones" },
  { id: 7, nombre: "Declaración Jurada de Beneficiarios Seguro Vida Ley" },
  { id: 8, nombre: "Acta de Matrimonio o Reconocimiento de Unión de Hecho + DNI de cónyuge" },
  { id: 9, nombre: "Certificado de Estudios de hijos (solo R. Civil)" },
  { id: 10, nombre: "Copia de DNI" },
  { id: 11, nombre: "Certificado de Antecedentes Penales" },
  { id: 12, nombre: "Curriculum Vitae con certificados de trabajos anteriores" },
  { id: 13, nombre: "Certificado de Retención de Quinta Categoría" },
  { id: 14, nombre: "DNI de cada Hijo Menor de Edad | Partida de Nacimiento hijos Mayores" },
  { id: 15, nombre: "Constancia firmada / entrega Boletín informativo SPP/SNP" },
  { id: 16, nombre: "Voucher Número de Cuenta" },
];

/** Normaliza el id del tipo de documento admitiendo los alias del backend (listado y detalle). */
function idDeDocumento(documento: DocumentoPostulante): number | null {
  const valor =
    documento.idDocumento ?? documento.idTipoDocumento ?? documento.documentoTipoId ?? documento.tipoDocumento;
  const id = Number(valor);
  return Number.isFinite(id) ? id : null;
}

/** `true` si el documento tiene archivo: el backend expone su id de registro o su ruta. */
function tieneArchivo(documento: DocumentoPostulante): boolean {
  const id = documento.id ?? documento.idDocumentoPostulante;
  const url = documento.archivoUrl ?? documento.url ?? documento.urlArchivo;
  const tieneId = id !== undefined && id !== null && id !== "";
  const tieneUrl = url !== undefined && url !== null && url !== "";
  return tieneId || tieneUrl;
}

/** Documento adjuntado para un tipo del catálogo, o null si todavía no se subió el archivo. */
export function obtenerDocumentoAdjunto(
  documentos: DocumentoPostulante[] | undefined,
  idDocumento: number,
): DocumentoPostulante | null {
  const documento = documentos?.find((registro) => idDeDocumento(registro) === idDocumento);
  return documento && tieneArchivo(documento) ? documento : null;
}

/**
 * Id del registro del documento (el "código" del PDF) que espera `GET /Postulacion/{id}/documento`.
 * Es distinto de la ruta del archivo: pasar la ruta como id genera URLs inválidas.
 */
export function obtenerIdDocumento(
  documentos: DocumentoPostulante[] | undefined,
  idDocumento: number,
): string | null {
  const adjunto = obtenerDocumentoAdjunto(documentos, idDocumento);
  const id = adjunto?.id ?? adjunto?.idDocumentoPostulante;
  return id === undefined || id === null || id === "" ? null : String(id);
}

/** Ruta del archivo subido (el backend la sirve desde la raíz, fuera de /api), o null si no se adjuntó. */
export function obtenerArchivoDocumento(
  documentos: DocumentoPostulante[] | undefined,
  idDocumento: number,
): string | null {
  const adjunto = obtenerDocumentoAdjunto(documentos, idDocumento);
  return adjunto?.archivoUrl ?? adjunto?.url ?? adjunto?.urlArchivo ?? null;
}

/** Cantidad de documentos adjuntos (el id 1 es la ficha de datos, no un archivo). */
export function contarDocumentosSubidos(documentos: DocumentoPostulante[] | undefined): number {
  return DOCUMENTOS.filter(
    (documento) => documento.id !== ID_FICHA_PERSONAL && obtenerDocumentoAdjunto(documentos, documento.id) !== null,
  ).length;
}
