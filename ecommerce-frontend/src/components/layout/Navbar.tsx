"use client"

import Link from "next/link";
import {useState, useRef, useEffect} from 'react';
import { ShoppingCart, Package } from "lucide-react";
import {UserDropdown} from "./UserDropdown"
import {SearchBar} from './Search'
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";


export function Navbar() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { clearCart } = useCartStore();
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthLoading(false);
        clearCart();
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); 
        } else {         
          logout();
        }
      } catch (error: any) {
        console.log("Error fetching user/ no token found:" );
      } finally {
        setIsAuthLoading(false);
      }
    }

    fetchUser();
  }, [setUser, logout]);
  

  
  return (
   <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Left Side: Brand & Main Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tight">
            SHOP XYZ
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/products" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
          </div>
        </div>

        {/* Right Side: Search, Cart, & Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Expanding Search Bar */}
          <SearchBar/>

          {/* Cart */}
          <Link 
            href="/cart" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium ml-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
          </Link>
          {/* Avatar */}
          <UserDropdown/>
        </div>
      </div>
    </nav>
  );
}

export default Navbar