import { create } from "zustand";
import { documentoService } from "../services/api";
import type { TipoDocumentoDto } from "../types/documento";

export interface DocumentoTipo extends TipoDocumentoDto {}

// Fallback offline / primer render: mismos 16 documentos, con valores por defecto
// que replican lo que hoy devuelve el API.
export const DOCUMENTOS: DocumentoTipo[] = [
  { id: 1, nombre: "Ficha de Personal", requerido: true, activo: true, orden: 1, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 2, nombre: "Certificado de Antecedentes Policiales", requerido: true, activo: true, orden: 2, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 3, nombre: "Certificado de Antecedentes Judiciales", requerido: true, activo: true, orden: 3, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 4, nombre: "Constancia de RETCC (solo R. Civil)", requerido: false, activo: true, orden: 4, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 5, nombre: "Declaración Jurada de Domicilio", requerido: true, activo: true, orden: 5, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 6, nombre: "Declaración Jurada de Afiliación al Sistema de Pensiones", requerido: true, activo: true, orden: 6, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 7, nombre: "Declaración Jurada de Beneficiarios Seguro Vida Ley", requerido: true, activo: true, orden: 7, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 8, nombre: "Acta de Matrimonio o Reconocimiento de Unión de Hecho + DNI de cónyuge", requerido: false, activo: true, orden: 8, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 9, nombre: "Certificado de Estudios de hijos (solo R. Civil)", requerido: false, activo: true, orden: 9, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 10, nombre: "Copia de DNI", requerido: true, activo: true, orden: 10, extensionesPermitidas: ".pdf,.jpg,.png", tamanoMaximoBytes: 5000000 },
  { id: 11, nombre: "Certificado de Antecedentes Penales", requerido: true, activo: true, orden: 11, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 12, nombre: "Curriculum Vitae con certificados de trabajos anteriores", requerido: true, activo: true, orden: 12, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 13, nombre: "Certificado de Retención de Quinta Categoría", requerido: false, activo: true, orden: 13, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 14, nombre: "DNI de cada Hijo Menor de Edad | Partida de Nacimiento hijos Mayores", requerido: false, activo: true, orden: 14, extensionesPermitidas: ".pdf,.jpg,.png", tamanoMaximoBytes: 5000000 },
  { id: 15, nombre: "Constancia firmada / entrega Boletín informativo SPP/SNP", requerido: true, activo: true, orden: 15, extensionesPermitidas: ".pdf", tamanoMaximoBytes: 10000000 },
  { id: 16, nombre: "Voucher Número de Cuenta", requerido: false, activo: true, orden: 16, extensionesPermitidas: ".pdf,.jpg,.png", tamanoMaximoBytes: 5000000 },
];

const STORAGE_KEY = "documentos_por_dni";

type DocumentosPorDni = Record<string, Record<string, string>>;

function cargar(): DocumentosPorDni {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as DocumentosPorDni;
  } catch {
    return {};
  }
}

interface DocumentoState {
  porDni: DocumentosPorDni;
  tipos: DocumentoTipo[];
  cargandoTipos: boolean;
  errorTipos: string | null;
  cargarTipos: () => Promise<void>;
  subir: (dni: string, id: number, nombreArchivo: string) => void;
}

export const useDocumentoStore = create<DocumentoState>((set, get) => ({
  porDni: cargar(),
  tipos: [],
  cargandoTipos: false,
  errorTipos: null,
  cargarTipos: async () => {
    if (get().cargandoTipos) return;
    set({ cargandoTipos: true, errorTipos: null });
    try {
      const data = await documentoService.listado();
      const ordenados = [...data]
        .filter((d) => d.activo)
        .sort((a, b) => a.orden - b.orden);
      set({ tipos: ordenados, cargandoTipos: false });
    } catch {
      set({ errorTipos: "No se pudo cargar la lista de documentos.", cargandoTipos: false });
    }
  },
  subir: (dni, id, nombreArchivo) => {
    const paraDni = { ...(get().porDni[dni] ?? {}), [id]: nombreArchivo };
    const nuevos = { ...get().porDni, [dni]: paraDni };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
    } catch {
      // ignorar fallos de almacenamiento
    }
    set({ porDni: nuevos });
  },
}));