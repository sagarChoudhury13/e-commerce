import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Left Side: App Title & Main Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
            SHOP XYZ
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/products" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
          </div>
        </div>

        {/* Right Side: Cart & Avatar */}
        <div className="flex items-center gap-6">
          <Link 
            href="/cart" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Avatar wrapped in a Link to a profile/account page */}
          <Link href="/account" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-border hover:opacity-80 transition-opacity">
              {/* Replace src with the actual user's image URL later */}
              <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
              {/* Fallback shows if the image fails to load */}
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