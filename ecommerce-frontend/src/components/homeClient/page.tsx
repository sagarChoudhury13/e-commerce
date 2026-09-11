"use client";

import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import type { Product } from "@/types";
import { ProductDialog } from "../products/ProductDialog";

const FEATURES = [
  { icon: Truck, title: "Free Express Shipping", desc: "On all orders over ₹300" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: RefreshCcw, title: "30-Day Returns", desc: "No questions asked policy" },
  { icon: Zap, title: "24/7 Support", desc: "Dedicated team to help you" },
];

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const {user} = useAuthStore();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setMounted(true);

    async function fetchHomepageData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?take=4`);
        
        if (res.ok) {
          const data = await res.json();
          setTrendingProducts(data.data);
        }
      } catch (error) {
        console.log("Failed to fetch trending products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomepageData();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[90vh] min-h-150 flex items-center justify-center overflow-hidden bg-muted/20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container px-4 md:px-6 z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150"
              style={{ animationFillMode: 'both' }}
            >
              REDEFINE YOUR <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
                SHOPPING EXPERIENCE
              </span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
              style={{ animationFillMode: 'both' }}
            >
              Welcome to SHOP XYZ. Discover premium apparel, cutting-edge accessories, and daily needs all at one place.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"
              style={{ animationFillMode: 'both' }}
            >
              {user ? (
                <Link href="\products">
                  <Button size="lg" className="h-14 px-8 text-base group transition-all hover:scale-105">
                    <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="\signup"> 
                    <Button size="lg" className="h-14 px-8 text-base group transition-all hover:scale-105">
                      Create a SHOP XYZ account  
                    </Button>
                  </Link>
                  <Link href="\login">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-base group transition-all hover:scale-105 bg-background/50 backdrop-blur-md">
                      Log in
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST FEATURES */}
      <section className="border-y bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-border">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center space-y-2 group p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-sm md:text-base mt-2">{feat.title}</h4>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    
      {/* 4. TRENDING PRODUCTS CAROUSEL/GRID */}
      <section className="bg-muted/30 py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1 text-sm bg-background">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" /> Just Dropped
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trending Right Now</h2>
            <p className="text-muted-foreground max-w-2xl">Handpicked styles pulled directly from our latest stock.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <div className="h-87.5 bg-muted/60 rounded-xl animate-pulse" />
                  <div className="h-4 bg-muted/60 rounded w-[80%] animate-pulse" />
                  <div className="h-4 bg-muted/60 rounded w-[40%] animate-pulse" />
                </div>
              ))
            ) : trendingProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No products available right now. Check back soon!
              </div>
            ) : (
              trendingProducts.map((product) => (
                <Card key={product.id} onClick={() => setSelectedProduct(product)} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-background cursor-pointer">
                  <div className="relative aspect-4/5 overflow-hidden bg-muted flex items-center justify-center">
                    
                    {product.tags && product.tags.length > 0 && (
                      <Badge className="absolute top-4 left-4 z-10 shadow-md bg-background text-foreground hover:bg-background">
                        {product.tags.split(",")[0]}
                      </Badge>
                    )}

                    {product.image_url ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${product.image_url})` }}
                      />
                    ) : (
                      <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-8 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent">
                      <Button className="w-full shadow-lg" size="sm">
                        <ShoppingBag className="mr-2 h-4 w-4" /> View Product
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="font-bold text-lg">₹{Number(product.price).toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-colors">
              <a href="/products">View All Products</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER CTA */}
      <section className="relative overflow-hidden py-24 bg-zinc-950 text-zinc-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-[70%] h-[150%] bg-linear-to-b from-primary/20 to-transparent rotate-12 blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Join the XYZ Club.</h2>
            <p className="text-zinc-400 text-lg">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-primary"
              />
              <Button size="lg" className="h-12 shrink-0 w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-zinc-600">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* RENDER DIALOG CONDITIONALLY */}
      {selectedProduct && (
        <ProductDialog 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onOpenChange={(open) => {
            if (!open) setSelectedProduct(null);
          }} 
        />
      )}
      
    </div>
  );
}

export default HomePage;