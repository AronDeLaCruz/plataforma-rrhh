import { create } from "zustand";
import type { Postulante } from "../types/postulante";

const STORAGE_KEY = "postulantes";

function cargar(): Postulante[] {
  try {
    const crudo = localStorage.getItem(STORAGE_KEY);
    return crudo ? (JSON.parse(crudo) as Postulante[]) : [];
  } catch {
    return [];
  }
}

interface PostulanteState {
  postulantes: Postulante[];
  save: (postulante: Postulante) => void;
}

export const usePostulanteStore = create<PostulanteState>((set, get) => ({
  postulantes: cargar(),
  // Crea el registro si no existe, o lo actualiza si ya existe (upsert).
  save: (postulante) => {
    const actuales = get().postulantes;
    const existe = actuales.some((p) => p.id === postulante.id);
    const siguientes = existe
      ? actuales.map((p) => (p.id === postulante.id ? postulante : p))
      : [...actuales, postulante];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siguientes));
    } catch {
      // ignorar fallos de almacenamiento
    }
    set({ postulantes: siguientes });
  },
}));