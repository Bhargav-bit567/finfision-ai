import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

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
        console.log(`Attempting login for: ${email}`);
        try {
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
          }

          const data = await response.json();
          console.log("Login successful:", data.user?.email);

          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (err) {
          console.error("Login Refresh Error:", err);
          const msg = err.message === "Failed to fetch" ? "Server connection failed" : err.message;
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },


      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        console.log(`Attempting signup for: ${email}`);
        try {
          const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Signup failed");
          }

          const data = await response.json();
          console.log("Signup successful:", data.user?.email);

          set({ 
            isLoading: false,
            error: null 
          });
          return { success: true };

        } catch (err) {
          console.error("Signup Refresh Error:", err);
          const msg = err.message === "Failed to fetch" ? "Server connection failed" : err.message;
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
