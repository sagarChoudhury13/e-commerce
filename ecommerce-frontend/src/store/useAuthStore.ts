import { User } from '@/types';
import { create } from 'zustand';

interface AuthState {
  user: User | null; // Replace 'any' with your User type
  setUser: (user: User| null) => void;
  logout: () => void;
}

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  logout: () => set({ user: null }),
}));