import { User } from '@/types';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  changeDefaultAddress: (addressId: number, onError: (code: string | undefined, message: string) => void
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
  changeDefaultAddress: async (addressId: number, onError) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }
      console.log(addressId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          defaultShippingAddress: Number(addressId)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify({
          code: errorData.errorCode,
          message: errorData.message
        }));
      }
      const {defaultShippingAddress} = await response.json();
      if (defaultShippingAddress) {
        set((state) => ({
          user: state.user
            ? { ...state.user, defaultShippingAddress: addressId }
            : null
        }))
      }} catch (err: any) {
        if (onError) {
          try {
            const parsedError = JSON.parse(err.message);
            onError(parsedError.code, parsedError.message);
          } catch {
            onError(undefined, "Network error. Is the server running?");
          }
        }
      }
    }
}));