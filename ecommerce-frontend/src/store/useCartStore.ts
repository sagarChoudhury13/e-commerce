import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: Record<number, number>;
  updateQuantity: (
    productId: number, 
    quantity: number, 
    onError?: (code: string | undefined, message: string) => void
  ) => Promise<void>;
  clearCart: () => void;
}

// Notice the updated syntax: create<CartStore>()(persist(...))
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: {},
      
      updateQuantity: async (productId, quantity, onError) => {
        // 1. Optimistic Update
        set((state) => {
          const newItems = { ...state.items };
          
          if (quantity <= 0) {
            delete newItems[productId];
          } else {
            newItems[productId] = quantity;
          }
          
          return { items: newItems };
        });

        // 2. Background Sync
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
              ...(token && { "Authorization": `Bearer ${token}` }),
            },
            body: JSON.stringify({ 
              productId: productId, 
              quantity: quantity 
            }), 
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify({ 
              code: errorData.errorCode, 
              message: errorData.message 
            }));
          }
        } catch (err: any) {
          if (onError) {
            try {
              const parsedError = JSON.parse(err.message);
              onError(parsedError.code, parsedError.message);
            } catch {
              onError(undefined, "Network error. Is the server running?");
            }
          }
        }
      },

      clearCart: () => set({ items: {} }),
    }),
    {
      name: 'cart-storage', 
    }
  )
);