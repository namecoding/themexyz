// lib/store/auth.ts
import { create } from "zustand";

type User = {
    name: string;
    email: string;
    a?: boolean;
    admin?: {
        permission: string[];
    };
    // add more fields as needed
};

type AuthState = {
    isLoggedIn: boolean;
    user: any | null;
    token: string | null;
    setIsLoggedIn: (status: boolean) => void;
    setUser: (user: any) => void;
    setToken: (token: string) => void;
    hasHydrated: boolean
    setHasHydrated: (status: boolean) => void
};

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    user: null,
    token: null,
    hasHydrated: false,
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setHasHydrated: (status) => set({ hasHydrated: status }),
}))
