"use client";
import { create, StoreApi, UseBoundStore } from "zustand";

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  setUser: (user: IUser) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useAuth: UseBoundStore<StoreApi<IAuthContext>> = create((set): IAuthContext => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  loading: true,
  setLoading: (loading) => set({ loading }),
}));

export { useAuth };