import { create } from "zustand";
import type { User } from "../types/auth";
import { authService, EVENTO_SESION_EXPIRADA } from "../services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  // true cuando ya se intentó recuperar la sesión guardada (evita redirigir al hidratar).
  initialized: boolean;
  init: () => void;
  login: (dni: string, codigo: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    loading: false,
    isAuthenticated: false,
    initialized: false,

    // Recupera la sesión guardada (JWT + usuario). Se llama una vez al montar la pantalla.
    init: () => {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (!token || !rawUser) {
            set({ initialized: true });
            return;
        }

        try {
            const user = JSON.parse(rawUser) as User;
            set({
                token,
                user,
                isAuthenticated: true,
                initialized: true,
            });
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ initialized: true });
        }
    },

    login: async (dni, codigo) => {
        set({ loading: true });
        try {            // El backend valida las credenciales y devuelve los datos del postulante.
            const payload = await authService.login(dni, codigo);

            // El backend emite un JWT propio: se persiste y el interceptor lo reenvía como Bearer.
            const token = payload.token;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(payload));

            set({
                user: payload,
                token,
                isAuthenticated: true,
                initialized: true,
                loading: false,
            });
            return true;
        } catch {
            set({ loading: false, isAuthenticated: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
        });
    }
}))

// El interceptor de axios limpia la sesion cuando el backend responde 401; este aviso mantiene
// sincronizado el estado en memoria (logout() es idempotente, repetir el listener no molesta).
if (typeof window !== "undefined") {
    window.addEventListener(EVENTO_SESION_EXPIRADA, () => {
        useAuthStore.getState().logout();
    });
}