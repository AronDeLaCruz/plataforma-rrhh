export interface User {
  /** El backend de login no expone un id propio: se resuelve con el email. */
  id?: string;
  email: string;
  nombre?: string;
  rol: string;
}

export interface LoginPayload {
  token: string;
  expiraEn: string;
  nombre: string;
  rol: string;
}

/** Respuesta típica del backend: { data: { token, user } } */
export interface LoginResponse {
  data: LoginPayload;
}

/** Usuario devuelto por GET /Usuario */
export interface UsuarioApi {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaCreacion?: string;
}
