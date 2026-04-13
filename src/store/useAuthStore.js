import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:5000/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!data.success) {
            set({ error: data.message, isLoading: false });
            return { success: false, error: data.message };
          }

          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (err) {
          const msg = "Server connection failed";
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();

          if (!data.success) {
            set({ error: data.message, isLoading: false });
            return { success: false, error: data.message };
          }

          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (err) {
          const msg = "Server connection failed";
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: "finfision-auth",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
