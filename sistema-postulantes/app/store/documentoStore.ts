import { create } from "zustand";

export interface DocumentoTipo {
  id: number;
  nombre: string;
}

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
  subir: (dni: string, id: number, nombreArchivo: string) => void;
}

export const useDocumentoStore = create<DocumentoState>((set, get) => ({
  porDni: cargar(),
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