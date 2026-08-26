"use client"

import Link from "next/link";
import {useState, useRef, useEffect} from 'react';
import { ShoppingCart, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {SearchBar} from './Search'


export function Navbar() {
  
  return (
   <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <Link href="/account" className="ml-2">
            <Avatar className="h-8 w-8 border border-border hover:opacity-80 transition-opacity">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar