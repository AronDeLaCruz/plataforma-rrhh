import axios from "axios";
import type { Postulante } from "../types/postulante";
import type { User } from "../types/auth";
import type { CrearFichaDto, FichaRespuestaDto } from "../types/ficha";

const API_URL = "http://localhost:5253/api"; //(import.meta.env.NEXT_URL ?? "http://localhost:5253/api").replace(
 // /\/$/,
 // "",
//);

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

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

// Aviso para que el store de Zustand (que guarda la sesion en memoria) tambien la limpie,
// sin crear un import circular entre api.tsx y authStore.ts.
export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // clave unificada con authStore
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (numeroDocumento: string, codigoAcceso: string): Promise<User> => {
    const response = await api.post<User>("/Postulacion/ingreso", { numeroDocumento, codigoAcceso });
    return response.data;
  }
}

export const postulanteService = {
  getAll: async (): Promise<Postulante[]> => {
    const response = await api.get<Postulante[]>("/Postulante");
    return response.data;
  },

  getById: async (dni: string): Promise<Postulante> => {
    const response = await api.get<Postulante>(`/Postulante/${dni}`);
    return response.data;
  },
};

export const fichaService = {

  create: async (dto: CrearFichaDto, idPostulacion:string): Promise<FichaRespuestaDto> => {
    const response = await api.post<FichaRespuestaDto>(`/Ficha/${idPostulacion}/ficha`, dto);
    return response.data;
  },
}

export const documentoService = {
  subir: async(idPostulacion:string, file: File, tipoDocumento: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipoDocumento", String(tipoDocumento)); // FormData solo acepta string o Blob

    const response = await api.post(`/Documento/${idPostulacion}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}