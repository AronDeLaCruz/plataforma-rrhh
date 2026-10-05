import { create } from "zustand";
import { authService, setUnauthorizedHandler } from "../services/api";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  init: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,

  init: () => {
    // Cuando la API responde 401 se cierra la sesión y App vuelve a mostrar el Login.
    setUnauthorizedHandler(() => get().logout());

    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    if (!token || !rawUser) return;

    try {
      const user = JSON.parse(rawUser) as User;
      set({
        token,
        user,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      // authService.login ya devuelve un LoginPayload validado y tipado.
      const payload = await authService.login(email, password);

      const user: User = {
          email,
          nombre: payload.nombre,
          rol: payload.rol,
      };

      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(user));
      set({
          user,
          token: payload.token,
          isAuthenticated: true,
          loading: false,
      });
      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
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
  },
}));
