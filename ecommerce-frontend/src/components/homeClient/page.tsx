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

// --- DUMMY DATA ---
const CATEGORIES = [
  { id: 1, name: "New Arrivals", title: "Latest Drops", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", span: "md:col-span-2 md:row-span-2" },
  { id: 2, name: "Accessories", title: "Elevate Your Look", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1" },
  { id: 3, name: "Footwear", title: "Step in Style", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1" },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: "Oversized Heavyweight Hoodie", price: "2,499", rating: 4.9, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop", tag: "Bestseller" },
  { id: 2, name: "Minimalist Chronograph", price: "4,299", rating: 4.8, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", tag: "Trending" },
  { id: 3, name: "Urban Tech Cargo Pants", price: "3,199", rating: 4.7, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop" },
  { id: 4, name: "Premium Leather Sneakers", price: "5,999", rating: 4.9, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", tag: "Limited" },
];

const FEATURES = [
  { icon: Truck, title: "Free Express Shipping", desc: "On all orders over ₹300" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: RefreshCcw, title: "30-Day Returns", desc: "No questions asked policy" },
  { icon: Zap, title: "24/7 Support", desc: "Dedicated team to help you" },
];

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const {user} = useAuthStore()

  useEffect(() => {
    setMounted(true);

  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[90vh] min-h-150 flex items-center justify-center overflow-hidden bg-muted/20">
        {/* Background Decorative Blobs */}
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
            >{user? <>
            <Link href = "\products">
              <Button size="lg" className="h-14 px-8 text-base group transition-all hover:scale-105">
                <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              </Link>
              </> : <>
              <Link href = "\signup"> 
              <Button size="lg" className="h-14 px-8 text-base group transition-all hover:scale-105">
                Create a SHOP XYZ account  
              </Button>
               </Link>
               <Link href = "\login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base group transition-all hover:scale-105 bg-background/50 backdrop-blur-md">
                Log in
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              </Link>
              </>  }
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
                <div 
                  key={i} 
                  className="flex flex-col items-center text-center space-y-2 group p-4"
                >
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

      {/* 3. BENTO GRID CATEGORIES */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
          <Button variant="ghost" className="hidden sm:flex group">
            View All Categories <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          {CATEGORIES.map((cat, i) => (
            <div 
              key={cat.id} 
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${cat.span}`}
            >
              {/* Image Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.img})` }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                <Badge variant="secondary" className="mb-3 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                  {cat.name}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {cat.title}
                </h3>
                <div className="flex items-center gap-2 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="text-sm font-medium">Explore Now</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
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
            <p className="text-muted-foreground max-w-2xl">Handpicked styles that are currently dominating the charts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-background">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {product.tag && (
                    <Badge className="absolute top-4 left-4 z-10 shadow-md">
                      {product.tag}
                    </Badge>
                  )}
                  {/* Product Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${product.img})` }}
                  />
                  
                  {/* Hover Add to Cart Action */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-8 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent">
                    <Button className="w-full shadow-lg" size="sm">
                      <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs font-medium shrink-0">
                      <Star className="h-3 w-3 fill-primary text-primary" /> {product.rating}
                    </div>
                  </div>
                  <p className="font-bold text-lg">₹{product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-colors">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER CTA */}
      <section className="relative overflow-hidden py-24 bg-zinc-950 text-zinc-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] bg-gradient-to-b from-primary/20 to-transparent rotate-12 blur-[100px]" />
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

    </div>
  );
}

export default HomePage