import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login } from "../../../shared/api";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            expiresAt: null,
            isAuthenticated: false,
            loading: false,

            login: async (emailOrUsername, password) => {
                set({ loading: true });
                try {
                    const response = await login({ emailOrUsername, password });
                    const result = response.data;

                    if (result.success && result.token) {
                        
                        // Check if role is USER_ROLE (agricultor)
                        // If it's an admin trying to login here, reject
                        if (result.userDetails?.role === 'Admin') {
                            set({ loading: false });
                            throw new Error("Acceso denegado. Este portal es solo para agricultores.");
                        }

                        set({
                            user: result.userDetails,
                            token: result.token,
                            expiresAt: result.expiresAt,
                            isAuthenticated: true,
                            loading: false
                        });
                        return result;
                    } else {
                        throw new Error(result.message || "Error de autenticación");
                    }
                } catch (error) {
                    set({ loading: false });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    expiresAt: null,
                    isAuthenticated: false,
                    loading: false
                });
            },

            checkAuth: () => {
                set((state) => {
                    // Si no hay token o ya expiró
                    if (!state.token || (state.expiresAt && new Date(state.expiresAt) < new Date())) {
                        return {
                            user: null,
                            token: null,
                            expiresAt: null,
                            isAuthenticated: false
                        };
                    }
                    return state;
                });
            }
        }),
        {
            name: "user-auth-storage", // Key used in local storage
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                expiresAt: state.expiresAt,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
