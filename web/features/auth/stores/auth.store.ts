import { create } from "zustand";

type User = {
  id: string;
  email: string | null;
  role: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthLoading: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthLoading: true,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isAuthLoading: loading }),
  logout: () =>
    set({
      accessToken: null,
      user: null,
      isAuthLoading: false,
    }),
}));
