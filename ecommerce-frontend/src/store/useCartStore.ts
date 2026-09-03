import { create } from 'zustand';
import type { Product } from '../types';

interface CartStore {
  items: Array<{ productId: number; quantity: number; products: Product }>; 
  isLoaded: boolean; // Tracks if the initial fetch is complete
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, onError?: (code: string | undefined, message: string) => void) => Promise<void>;
  updateQuantity: (
    productId: number, 
    quantity: number, 
    onError?: (code: string | undefined, message: string) => void
  ) => Promise<void>;
  clearCartItem: (productId: number, onError?: (code: string | undefined, message: string) => void) => Promise<void>,
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isLoaded: false,

  // 1. Fetch existing cart from the database on initial load
  fetchCart: async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if(token === null){
        set({ isLoaded: true });
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "GET",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` }),
        }
      });

      if (response.ok) {
        const cartData = await response.json();

        const fetchedItems = cartData.map((item:any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          products: item.products, 
        }));

        set({ items: fetchedItems, isLoaded: true });
      }
      
    } catch (error) {
      console.log(error);
      set({ isLoaded: true });
    }
  },
  addToCart: async (product: Product, onError) => {
    const newItem = {
    productId : product.id,
    quantity: 1,
    products: product, 
  };

  set((state) => ({
    items: [...state.items, newItem],
  }));
    try{
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({ productId : product.id, quantity : 1 }),
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(JSON.stringify({ 
          code: errorData.errorCode, 
          message: errorData.message 
        }));
      }
    }catch (err: any) {
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
  // 3. Optimistic Update (Existing logic)
  updateQuantity: async (productId: number, newQuantity: number, onError) => {
    
   set((state) => ({
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({ 
          quantity: newQuantity 
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

  clearCartItem: async(productId: number, onError) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        }
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
  clearCart: () => set({ items: [] })
}));