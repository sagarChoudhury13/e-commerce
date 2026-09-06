import type { Address } from "@/types/index";
import { create } from 'zustand';

export interface NewAddress {
    lineOne: string;
    lineTwo: string | null;
    city: string;
    pincode: string;
    country: string;
}

interface AddressStore {
    addresses: Address[];
    setAddresses: () => Promise<void>;
    addAddress: (address: NewAddress, onError?: (code: string | undefined, message: string) => void) => Promise<void>;
    removeAddress: (id: number, onError?: (code: string | undefined, message: string) => void) => Promise<void>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
    // 1. Initial state
    addresses: [],

    // 2. Overwrite the entire array (great for initial fetch from backend)
    setAddresses: async () => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token === null) {
                set({ addresses: [] });
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/address`, {
                method: "GET",
                headers: {
        "Content-Type": "application/json", // <-- THIS IS CRITICAL
        "Authorization": `Bearer ${token}`
      },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch addresses");
            }

            const data = await response.json();
            console.log("Fetched addresses:", data);
            set({ addresses: data });
        } catch (err: any) {
            console.log(err);
            set({ addresses: [] });
        }
    },

    // 3. Append a new address to the existing array
    addAddress: async (address: NewAddress, onError) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token === null) {
                onError?.(undefined, "User not authenticated");
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/address`, {
                method: "POST",
               headers: {
        "Content-Type": "application/json", // <-- ADD THIS LINE
        ...(token && { "Authorization": `Bearer ${token}` }),
    },
                body: JSON.stringify({
                    lineOne: address.lineOne,
                    lineTwo: address.lineTwo,
                    city: address.city,
                    pincode: address.pincode,
                    country: address.country
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                onError?.(errorData.code, errorData.message || "Failed to add address");
            }
            const newAddress = await response.json();
            set((state) => ({
                addresses: [...state.addresses, newAddress]
            }));
            
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

    // 4. Remove an address by filtering out the specific index
    removeAddress: async (id: number, onError) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token === null) {
                onError?.(undefined, "User not authenticated");
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/address/${id}`, {
                method: "DELETE",
                headers: {
        "Content-Type": "application/json", // <-- ADD THIS LINE
        ...(token && { "Authorization": `Bearer ${token}` }),
    },
            });

            if (!response.ok) {
                const errorData = await response.json();
                onError?.(errorData.code, errorData.message || "Failed to delete address");
            }
            set((state) => ({
                addresses: state.addresses.filter((a) => a.id !== id)
            }));
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
    }
}));